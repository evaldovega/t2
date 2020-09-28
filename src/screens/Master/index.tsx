import React from 'react'
import {createDrawerNavigator, DrawerContent} from '@react-navigation/drawer'
import {Dimensions} from 'react-native'
import Dashboard from './Dashboard'
import Profile from './Profile'
import CapacitacionListado from './Capacitacion/Listado'
import Lead from './Client/Lead'
import ChatUsers from './Chat/Users'
import SideMenu from '../../components/SideMenu'



const Drawer =   createDrawerNavigator()


const {width,height} = Dimensions.get('screen');

const Hiden = ()=>{
    return (null)
}

export default class Master extends React.Component{
    
    onPressMenu =()=>{
        this.props.navigation.openDrawer();
    }

    render(){
        return (
            <Drawer.Navigator style={{flex:1}} DrawerContent={(props)=><SideMenu {...props}/>}  initialRouteName='Profile' drawerType={width >= 768 ? 'permanent' : 'back'}>
                <Drawer.Screen name='Profile' component={Profile} />
                <Drawer.Screen name='Dashboard' component={Dashboard} />
                <Drawer.Screen name='Capacitaciones' component={CapacitacionListado}/>
                <Drawer.Screen name='Clientes' component={Lead}/>
                <Drawer.Screen name='ChatUsers' component={ChatUsers}/>
            </Drawer.Navigator>
        )
    }
}
