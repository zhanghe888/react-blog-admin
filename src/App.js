import React, { Component } from 'react';
import {Route,Switch,Redirect} from 'react-router-dom'
import {connect} from 'react-redux'
import {adminRoutes} from './routes'
import {Home} from './views'
import {getmenulist} from './actions/menuAction'
const mapState = state => ({
  menulist:state.menus.menulist
})
@connect(mapState,{getmenulist})

class App extends Component {
  componentWillMount(){
    let routes = JSON.parse(JSON.stringify(adminRoutes))
    const menus = this.getMenus(routes)
    this.props.getmenulist(menus)
  }
  getMenus = (adminRoutes) => {
    for(let i = 0;i<adminRoutes.length;i++){
      if(!adminRoutes[i].children){
        if(!adminRoutes[i].isNav){
          adminRoutes.splice(i,1)
        }
      }else{
          this.getMenus(adminRoutes[i].children)
      }
    }
    return adminRoutes
  }
  // 利用递归渲染动态路由
  renderRoute = (adminRoutes) => {
    return adminRoutes.map(route=>{
        if(!route.children){
          return (
            <Route 
              key={route.pathname}
              path={route.pathname}
              exact={route.exact}
              render={routerProps=>{
                return <route.component {...routerProps}/>
              }}
            />
          )
        }else{
          return (
            this.renderRoute(route.children)
          )
        }
    })
  }
  render() {
    return (
      <Home >
        <Switch>
          {
            this.renderRoute(adminRoutes)
          }
          <Redirect to={adminRoutes[0].pathname} from="/admin" exact />
          <Redirect to="/404" />
        </Switch>
      </Home>
    );
  }
}

export default App;