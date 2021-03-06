import Login from './views/Login.vue'
import NotFound from './views/404.vue'
import Home from './views/Home.vue'
import Main from './views/Main.vue'
import Table from './views/nav1/Table.vue'
import Form from './views/nav1/Form.vue'
import user from './views/nav1/user.vue'
import Page4 from './views/nav2/Page4.vue'
import Page5 from './views/nav2/Page5.vue'
import Page6 from './views/nav3/Page6.vue'
import echarts from './views/charts/echarts.vue'
import Comment from './views/nav1/Comment.vue'
import Banner from './views/nav1/Banner.vue'
import Branch from './views/nav1/Branch.vue'
import MalfunctionDetail from './views/nav1/MalfunctionDetail.vue'
import Order from './views/nav1/Order.vue'
import Recycle from './views/nav2/Recycle.vue'

let routes = [
    {
        path: '/login',
        component: Login,
        name: '',
        hidden: true
    },
    {
        path: '/404',
        component: NotFound,
        name: '',
        hidden: true
    },
    
    //{ path: '/main', component: Main },
    {
        path: '/',
        component: Home,
        name: '维修信息',
        iconCls: 'el-icon-message',//图标样式class
        children: [
            { path: '/main', component: Main, name: 'main', hidden: true },
            { path: '/table', component: Table, name: '品牌' },
            { path: '/form', component: Form, name: '型号' },
            { path: '/comment', component: Comment, name: '故障信息' },
            { path: '/banner', component: Banner, name: '主界面滑动'},
            { path: '/branch', component: Branch, name: '分店'},
            { path: '/malfunctiondetail', component: MalfunctionDetail, name: '故障细节'},
            { path: '/order', component: Order, name: '订单信息'}
        ]
    },
    
    {
        path: '/',
        component: Home,
        name: '回收信息',
        iconCls: 'fa fa-id-card-o',
        children: [
            { path: '/recycle', component: Recycle, name: '回收品牌' },
            { path: '/page4', component: Page4, name: '回收机型' },
            { path: '/page5', component: Page5, name: '回收设置' }
            
        ]
    },
    {
        path: '/',
        component: Home,
        name: '',
        iconCls: 'fa fa-address-card',
        leaf: true,//只有一个节点
        children: [
            { path: '/page6', component: Page6, name: '导航三' }
        ]
    },
    
    {
        path: '*',
        hidden: true,
        redirect: { path: '/404' }
    }
];

export default routes;