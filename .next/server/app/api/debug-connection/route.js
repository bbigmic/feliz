"use strict";(()=>{var e={};e.id=228,e.ids=[228],e.modules={3524:e=>{e.exports=require("@prisma/client")},399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},9904:(e,t,a)=>{a.r(t),a.d(t,{originalPathname:()=>_,patchFetch:()=>g,requestAsyncStorage:()=>d,routeModule:()=>c,serverHooks:()=>m,staticGenerationAsyncStorage:()=>l});var r={};a.r(r),a.d(r,{GET:()=>p});var n=a(9303),s=a(8716),u=a(670),i=a(7070),o=a(3524);async function p(){try{let e=new o.PrismaClient,t=await e.$queryRaw`
      SELECT 
        current_database() as database_name,
        current_user as current_user,
        version() as postgres_version,
        NOW() as current_time
    `,a=await e.$queryRaw`
      SELECT 
        schemaname,
        relname as tablename,
        n_tup_ins::text as inserts,
        n_tup_upd::text as updates,
        n_tup_del::text as deletes
      FROM pg_stat_user_tables 
      WHERE relname = 'Order'
    `,r=await e.$queryRaw`
      SELECT 
        schemaname,
        relname as tablename,
        last_vacuum,
        last_autovacuum,
        last_analyze,
        last_autoanalyze
      FROM pg_stat_user_tables 
      WHERE relname = 'Order'
    `,n=await e.$queryRaw`
      SELECT 
        schemaname,
        relname as tablename,
        n_tup_ins::text as inserts,
        n_tup_upd::text as updates,
        n_tup_del::text as deletes
      FROM pg_stat_user_tables 
      ORDER BY relname
    `;return await e.$disconnect(),i.NextResponse.json({success:!0,connectionInfo:t,tableInfo:a,recentActivity:r,allTables:n,timestamp:new Date().toISOString()})}catch(e){return console.error("Debug connection error:",e),i.NextResponse.json({error:String(e),message:"Błąd sprawdzania połączenia"},{status:500})}}let c=new n.AppRouteRouteModule({definition:{kind:s.x.APP_ROUTE,page:"/api/debug-connection/route",pathname:"/api/debug-connection",filename:"route",bundlePath:"app/api/debug-connection/route"},resolvedPagePath:"/Users/bigmic/Desktop/apki/feliztrade/app/api/debug-connection/route.ts",nextConfigOutput:"",userland:r}),{requestAsyncStorage:d,staticGenerationAsyncStorage:l,serverHooks:m}=c,_="/api/debug-connection/route";function g(){return(0,u.patchFetch)({serverHooks:m,staticGenerationAsyncStorage:l})}}};var t=require("../../../webpack-runtime.js");t.C(e);var a=e=>t(t.s=e),r=t.X(0,[276,972],()=>a(9904));module.exports=r})();