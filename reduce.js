const obj = {
    name:'jack',
    age:20,
    info:{
        address:{
            localhost:'大理'
        }
    }
}
const attr = 'info.address.localhost'
const a = attr.split('.').reduce((newObj,k)=>newObj[k],obj)

/**
 * 第一次循环
 *      初始值是obj，item项是info
 *      reduce结果是obj.info属性的对象
 */
console.log(a)