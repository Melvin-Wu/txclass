
function initMenu() {
	var tmp = document.URL.split( "/" ); 
	var thisFile = tmp[ tmp.length-1 ];
	var ret=[
		//{url:"new_bs.html",status:"",icon:"icon-leaf",name:"业务接入"},
		//{url:"badip.html",status:"",icon:"icon-list",name:"故障处理"},
		{
			status:"",
			icon:"icon-cloud",
			name:"乐视工具",
			submenu:[
				{url:"letv_config.html", icon:"icon-ban-circle", name:"配置"},
				{url:"letv_prefetch.html", icon:"icon-ban-circle", name:"内容管理"}
			]
		},

		{
			status:"",
			icon:"icon-cloud",
			name:"帝联工具",
			submenu:[
				{url:"dnion_config.html", icon:"icon-ban-circle", name:"配置"}
			]
		},

		{
			status:"",
			icon:"icon-cloud",
			name:"网宿工具",
			submenu:[
				{url:"ws_config.html", icon:"icon-ban-circle", name:"配置"}
			]
		},
		{
			status:"",
			icon:"icon-cloud",
			name:"内容管理",
			submenu:[
				{url:"dir_remove_list.html", icon:"icon-ban-circle", name:"目录删除"},
				{url:"file_remove_list.html", icon:"icon-ban-circle", name:"文件删除"},
				{url:"prefetch_list.html", icon:"icon-cloud-download", name:"文件预取"}
			]
		},
		{
			status:"",
			icon:"icon-cogs",
			name:"机房管理",
			submenu:[
				{url:"oc.html",icon:"icon-search",name:"节点管理"},
				{url:"ip.html",icon:"icon-search",name:"设备管理"}
			]
		},
		{
			status:"",
			icon:"icon-text-width",
			name:"自动部署",
			submenu:[
				{url:"deploy_list.html",icon:"icon-search",name:"文件分发"},
				{url:"cmd_list.html",icon:"icon-search",name:"指令执行"}
			]
		},
		{
			status:"",
			icon:"icon-bar-chart",
			name:"流量统计",
			submenu:[
				{url:"bandwidth_query.html",icon:"icon-search",name:"带宽查询"},
				{url:"flux_query.html",icon:"icon-search",name:"流量查询"},
				{url:"oc_flux_stat.html",icon:"icon-search",name:"OC机房统计"},
				{url:"domain_flux_stat.html",icon:"icon-search",name:"域名统计"}
			]
		},
		{
			status:"",
			icon:"icon-desktop",
			name:"域名管理",
			submenu:[
				{url:"domain_list.html",icon:"icon-search",name:"加速域名"},
				{url:"dns_list.html",icon:"icon-search",name:"DNS配置"}
			]
		},

        {
            status:"",
            icon:"icon-desktop",
            name:"转码管理",
            submenu:[
            {url:"Conver_format.html",icon:"icon-search",name:"转码任务状态"},
            {url:"Conver_Format_Task_List.html", icon:"icon-search",name:"转码任务提交"}
          ]
        },
	
       {
            status:"",
            icon:"icon-desktop",
            name:"直播管理",
            submenu:[
            {url:"stream_list.html",icon:"icon-search",name:"流ID管理"},
            {url:"ssinfo.html",icon:"icon-search",name:"自建源管理"}
          ]
        },
        



       /* {url:"conver_format.html",status:"",icon:"icon-dashboard",name:"Conver_Format"}*/
		{url:"index.html",status:"",icon:"icon-dashboard",name:"监控视图"}
	];
	var h="";
	for (var i = ret.length - 1; i >= 0; i--) {
		if(ret[i]["submenu"]==undefined)
		{
			var menuStat="";
			if(ret[i]["url"]==thisFile)
				menuStat="class=\"active\"";
			var menu="<li "+menuStat+" ><a href=\""+ret[i]["url"]+"\"><i class=\""+ret[i]["icon"]+"\"></i><span class=\"menu-text\">"+ret[i]["name"]+"</span></a></li>";
			h+=menu;
		}
		else
		{
			var menuStat="";
			for (var j = ret[i]["submenu"].length - 1; j >= 0; j--) {
				if(ret[i]["submenu"][j]["url"]==thisFile)
					menuStat="class=\"active open\"";
			}
			
			var menu="<li "+menuStat+" ><a href=\"#\" class=\"dropdown-toggle\"><i class=\""+ret[i]["icon"]+"\"></i><span class=\"menu-text\"> "+ret[i]["name"]+" </span><b class=\"arrow icon-angle-down\"></b></a><ul class=\"submenu\">";

			for (var j = ret[i]["submenu"].length - 1; j >= 0; j--) {
				var menuStat2="";
    			if(ret[i]["submenu"][j]["url"]==thisFile)
    				menuStat2="class=\"active\"";

				menu+="<li "+menuStat2+" ><a href=\""+ret[i]["submenu"][j]["url"]+"\"><i class=\""+ret[i]["submenu"][j]["icon"]+"\"></i><span class=\"menu-text\">"+ret[i]["submenu"][j]["name"]+"</span></a></li>";
			};

			menu+="</ul></li>";
			h+=menu;
		}
	}
	$("#mainMenu").html(h);
}
