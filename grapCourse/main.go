package main

import(
        "fmt"
        "bufio"
        "io"
        "os"
        "strings"
        "github.com/bitly/go-simplejson"
        "github.com/marco2013/smartDB"
        "./myhttp"
)


//读取key=value类型的配置文件
func InitConfig(path string) map[string]string {
        config := make(map[string]string)

        f, err := os.Open(path)
        defer f.Close()
        if err != nil {
                panic(err)
        }

        r := bufio.NewReader(f)
        for {
                b, _, err := r.ReadLine()
                if err != nil {
                        if err == io.EOF {
                                break
                        }
                        panic(err)
                }
                s := strings.TrimSpace(string(b))
                index := strings.Index(s, "=")
                if index < 0 {
                        continue
                }
                key := strings.TrimSpace(s[:index])
                if len(key) == 0 {
                        continue
                }
                value := strings.TrimSpace(s[index+1:])
                if len(value) == 0 {
                        continue
                }
                config[key] = value
        }
        return config
}


func grapCourse(subjects string, grades string, mymap map[string]string){
        dburl := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?charset=utf8",mymap["user"],mymap["password"],mymap["host"],mymap["port"],mymap["database"])
        fmt.Printf("dburl :%s\n", dburl)

        //"root:bluedogge@tcp(112.125.24.238:3306)/txcourse?charset=utf8"
        db, err := smartDB.NewDb("mysql", dburl)
        if err != nil {
                fmt.Println("SQL conncet:", err.Error())
                return
        }
        defer db.Close()

        subjectsArray := strings.Split(subjects,",")
        gradesArray := strings.Split(grades,",")


        for i,v1 := range subjectsArray {
                for j,v2 := range gradesArray {
                        fmt.Printf("subject :%d ,%s,grade:%d, %s \n", i,v1,j,v2)

                        url := fmt.Sprintf("https://fudao.qq.com/cgi-proxy/course/discover_subject?client=4&platform=3&version=30&grade=%v&subject=%v&showid=0&page=1&size=10&t=0.24549794142780268",v2,v1)
                        //https://fudao.qq.com/grade/6001/subject/6005/
                        referer := fmt.Sprintf("https://fudao.qq.com/grade/%v/subject/%v/",v2,v1)

                        headers := map[string]string{
                                "Referer":referer}
                        params := map[string]string{
                        }
                        resp, err := myhttp.Get(url, params, headers)
                        parse, err := myhttp.Parse(resp)
                        if err != nil {
                                fmt.Printf("err = %s \n", err.Error())
                                return
                        }
                        
                        js, err := simplejson.NewJson([]byte(parse.(string)))
                        if err !=nil || js == nil{
                                fmt.Printf("something wrong when call NewJson")
                                return
                        }
                        speCourseArr,err := js.Get("result").Get("spe_course_list").Get("data").Array()
                        sysCourseArr,err := js.Get("result").Get("sys_course_pkg_list").Array()

                        fmt.Printf("speCourseArr====%d, sysCourseArr====%d \n",len(speCourseArr),len(sysCourseArr))

                        if (len(speCourseArr)==0 && len(sysCourseArr)==0 ){
                                fmt.Printf("emptyyyyy url:%v,referer:%v \n",url, referer)
                        }

                        //特殊课程
                        for i, _ := range speCourseArr {
                                _course := js.Get("result").Get("spe_course_list").Get("data").GetIndex(i)
                                cid := _course.Get("cid").MustInt()
                                name := _course.Get("name").MustString()
                                time_plan :=  _course.Get("time_plan").MustString()
                                teArray,err := _course.Get("te_list").Array()

                                var te_name string
                                for k,_ := range teArray{
                                        _info := _course.Get("te_list").GetIndex(k)
                                        te_name += _info.Get("name").MustString() + " "
                                }

                                sql2 := fmt.Sprintf("insert into t_spe_course_info (grade,subject,cid,name,time_plan,te_name,created) values (%s,%s,%d,'%s','%s','%s',now()) on duplicate key update name='%s',time_plan='%s',te_name='%s';", v2,v1,cid,name,time_plan,te_name,name,time_plan,te_name)
                                instid2, err := db.Insert(sql2)
                                if err != nil {
                                        fmt.Println("insert SQL error:", err.Error())
                                        break
                                }
                                fmt.Println(instid2)

                        }

                        //平常课程
                        for i, _ := range sysCourseArr {

                                course := js.Get("result").Get("sys_course_pkg_list").GetIndex(i)
                                fmt.Println(course)

                                subject_package_id := course.Get("subject_package_id").MustString()
                                title := course.Get("title").MustString()
                                course_bgtime := course.Get("course_bgtime").MustInt64()
                                course_endtime := course.Get("course_endtime").MustInt64()
                                sold_count := course.Get("sold_count").MustInt64()
                                course_min_price := course.Get("course_min_price").MustInt64()
                                course_max_price := course.Get("course_max_price").MustInt64()

                                
                                //insert db
                                sql := fmt.Sprintf("insert into t_sys_course_base_info (grade,subject,subject_package_id,title,course_bgtime,course_endtime,sold_count,course_min_price,course_max_price,created) values (%s,%s,'%s','%s',%d,%d,%d,%d,%d,now()) on duplicate key update title='%s',course_bgtime=%d,course_endtime=%d,sold_count=%d,course_min_price=%d,course_max_price=%d;", v2,v1,subject_package_id,title,course_bgtime,course_endtime,sold_count,course_min_price,course_max_price,title,course_bgtime,course_endtime,sold_count,course_min_price,course_max_price)

                                fmt.Println(sql)

                                instid, err := db.Insert(sql)
                                if err != nil {
                                        fmt.Println("insert SQL error:", err.Error())
                                        break
                                }
                                fmt.Println(instid)
                                

                                surl := fmt.Sprintf("%s%s%s","https://fudao.qq.com/cgi-proxy/course/get_course_package_info?client=4&platform=3&version=30&subject_package_id=",subject_package_id,"&t=0.6655795271578293")
                                
                                sreferer := fmt.Sprintf("%s%s","https://fudao.qq.com/subject/6001/subject_system/",subject_package_id)

                                sheaders := map[string]string{
                                        "Referer": sreferer}
                                sparams := map[string]string{
                                }
                                respone, err := myhttp.Get(surl, sparams, sheaders)
                                second, err := myhttp.Parse(respone)
                                if err != nil {
                                        fmt.Printf("err = %s \n", err.Error())
                                        break
                                }
                                //mt.Println(second)

                                sjs, err := simplejson.NewJson([]byte(second.(string)))
                                if err !=nil || sjs == nil{
                                        fmt.Printf("something wrong when call NewJson")
                                        break
                                }
                                courseDetailArr,err := sjs.Get("result").Get("courses").Array()
                                //fmt.Println(len(courseDetailArr))

                                for index, _ := range courseDetailArr {
                                        _course := sjs.Get("result").Get("courses").GetIndex(index)
                                        cid := _course.Get("cid").MustInt()
                                        name := _course.Get("name").MustString()
                                        time_plan :=  _course.Get("time_plan").MustString()
                                        tu_name := _course.Get("class_info").Get("tu_list").GetIndex(0).Get("name").MustString()
                                        te_name := _course.Get("te_list").GetIndex(0).Get("name").MustString()

                                        sql2 := fmt.Sprintf("insert into t_sys_course_detail_info (subject_package_id,cid,name,time_plan,tu_name,te_name,created) values ('%s',%d,'%s','%s','%s','%s',now()) on duplicate key update name='%s',time_plan='%s',tu_name='%s',te_name='%s';", subject_package_id,cid,name,time_plan,tu_name,te_name,name,time_plan,tu_name,te_name)
                                        instid2, err := db.Insert(sql2)
                                        if err != nil {
                                                fmt.Println("insert SQL error:", err.Error())
                                                break
                                        }
                                        fmt.Println(instid2)

                                }

                        }





                }
        }


}

func main(){

        config := InitConfig("./config")
        fmt.Println(config)

        subjectsgao := config["subjectsgao"]
        gradesgao := config["gradesgao"]

        subjectsyou := config["subjectsyou"]
        gradesyou := config["gradesyou"]

        subjectsxiao := config["subjectsxiao"]
        gradesxiao := config["gradesxiao"]

        subjectschu := config["subjectschu"]
        gradeschu := config["gradeschu"]

        grapCourse(subjectsgao,gradesgao,config)
        grapCourse(subjectsyou,gradesyou,config)
        grapCourse(subjectsxiao,gradesxiao,config)
        grapCourse(subjectschu,gradeschu,config) 
        
}