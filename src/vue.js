
class Vue {
    constructor(options) {
        this.$data = options.data

        //调用Observe方法给data里的数据都添加getter，setter方法
        Observe(this.$data)

        //把$data的数据直接放到vm上
        Object.keys(this.$data).forEach(key => {
            Object.defineProperty(this, key, {
                enumerable: true,
                configurable: true,
                get() {
                    return this.$data[key]
                },
                set(newValue) {
                    this.$data[key] = newValue
                }
            })
        })

        //调用模板编译的函数
        Compile(options.el, this)

    }
}

//定义一个数据劫持的方法
function Observe(obj) {
    //判断obj是否为对象，如果时对象要递归执行
    if (!obj || typeof obj !== 'object') return

    const dep = new Dep()
    //通过Object.keys获取到obj上的每个节点['name','age','info']
    Object.keys(obj).forEach(key => {
        let value = obj[key]
        Observe(value)
        Object.defineProperty(obj, key, {
            enumerable: true,
            configurable: true,
            get() {
                // 只要执行了下面这一行，那么刚才 new 的 Watcher 实例，
                // 就被放到了 dep.subs 这个数组中了
                Dep.target && dep.addSubs(Dep.target)
                return value
            },
            set(newValue) {
                value = newValue
                Observe(value)
                // 通知每一个订阅者更新自己的文本
                dep.notify()
            }
        })
    })
}

//模板编译函数
function Compile(el, vm) {
    //获取el对应的模板元素
    vm.$el = document.querySelector(el)

    //创建文档碎片，优化重绘重排
    //  1.创建一个空碎片用来保存节点
    const fragment = document.createDocumentFragment()

    //  2.便利el，每次获取到第一个子节点
    while ((childNode = vm.$el.firstChild)) {
        //  2.1.把获取到的子节点添加到fragment中
        fragment.appendChild(childNode)
    }

    //  3.对DOM模板进行编译
    replace(fragment)

    //  4.把fragment整个再添加到el上
    vm.$el.appendChild(fragment)


    //模板编译函数
    function replace(node) {
        const regMustache = /\{\{\s*(\S+)\s*\}\}/
        //证明当前节点是一个文本子节点，需要替换。nodeType可以获得节点的类型
        if (node.nodeType === 3) {
            const text = node.textContent
            //
            const execResult = regMustache.exec(text)
            if (execResult) {
                //获取{{}}里的内容
                const value = execResult[1].split('.').reduce((newObj, k) => newObj[k], vm)
                //替换
                node.textContent = text.replace(regMustache, value)
                //创建一个Watcher实例
                new Watcher(vm, execResult[1], (newValue => node.textContent = text.replace(regMustache, newValue)))
            }
            return
        }
        //判断当前节点是否为输入框
        if (node.nodeType === 1 && node.tagName.toUpperCase('INPUT')) {
            //得到当前节点的所有属性节点
            const attrs = Array.from(node.attributes)
            console.log(attrs)
            const findResult = attrs.find(x => x.name === 'v-model')
            console.log(findResult)
            if (findResult) {
                const expStr = findResult.value
                const value = expStr.split('.').reduce((newObj, k) => newObj[k], vm)
                node.value = value
                // 创建 Watcher 的实例
                new Watcher(vm, expStr, (newValue) => {
                    node.value = newValue
                })
                // 监听文本框的 input 输入事件，拿到文本框最新的值，把最新的值，更新到 vm 上即可
                node.addEventListener('input', (e) => {
                    const keyArr = expStr.split('.')
                    const obj = keyArr.slice(0, keyArr.length - 1).reduce((newObj, k) => newObj[k], vm)
                    const leafKey = keyArr[keyArr.length - 1]
                    obj[leafKey] = e.target.value
                })
            }

        }
        //如果不是一个文本节点，递归处理
        node.childNodes.forEach(child => replace(child))
    }
}
//依赖收集的类
class Dep {
    constructor() {
        this.subs = []
    }

    //所有的watcher实例都要添加到subs
    addSubs(watcher) {
        this.subs.push(watcher)
    }

    //调用watcher实例的方法
    notify() {
        this.subs.forEach(watcher => watcher.update())
    }
}

class Watcher {
    // cb 回调函数中，记录着当前 Watcher 如何更新自己的文本内容
    //    但是，只知道如何更新自己还不行，还必须拿到最新的数据，
    //    因此，还需要在 new Watcher 期间，把 vm 也传递进来（因为 vm 中保存着最新的数据）
    // 除此之外，还需要知道，在 vm 身上众多的数据中，哪个数据，才是当前自己所需要的数据，
    //    因此，必须在 new Watcher 期间，指定 watcher 对应的数据的名字
    constructor(vm, key, cb) {
        this.vm = vm
        this.cb = cb
        this.key = key

        Dep.target = this
        //取值只是为理财触发新值上的getter
        key.split('.').reduce((newObj, k) => newObj[k], vm)
        Dep.target = null
    }

    //通过update函数调用实例的回调函数
    update() {
        console.log('update执行了')
        const value = this.key.split('.').reduce((newObj, k) => newObj[k], this.vm)
        console.log(value, 'name')
        this.cb(value)
    }
}