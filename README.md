gulp+webpack项目
===============

##gulp+webpack多页面应用自动化环境搭建
    采用该环境进行开发时，遵循“约定大于配置”的方案：
    1.src/.../html/ 目录下存放html文件
    2.src/.../js/module 目录下存放js入口文件 遵循一个html文件一个js入口文件，所以要保持目录结构与html目录结构一一对应
    3.约定一个html文件对应一个css入口文件
    4.可以分离出js,css的公共文件以<script><link>标签的方式插入到html文件中
***
# 前置条件 #
1. Node.js  

***
# 环境配置 #

    npm install  
***    
# 开发环境 # 
### webApp ###
    gulp develop  开启server
### webAdmin(暂时还未搭建) ###

***
# 生成环境 #
### webApp ###
    gulp build 输出文件到build
    gulp server 开启生成环境server
### webAdmin(暂时未搭建) ###
***       
