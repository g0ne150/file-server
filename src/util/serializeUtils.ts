const JSON_NAME_LIST_METADATA_KEY = Symbol("json-name-list-key")
const JSON_IGNORE_METADATA_KEY = Symbol("jsno-ignore-key")

type JSONFieldParamter = { name?: string | symbol; ignore?: boolean }
// 实现 JSONField 控制 json 序列化过程
export const JSONField = function (
    params: JSONFieldParamter = {}
): PropertyDecorator {
    return (target: any, propertyKey: string | symbol) => {
        const { name, ignore } = params
        const nameList: (string | symbol)[] =
            Reflect.getMetadata(JSON_NAME_LIST_METADATA_KEY, target) || []

        if (name && name !== propertyKey) {
            nameList.push(name)
        } else {
            nameList.push(propertyKey)
        }
        Reflect.defineMetadata(JSON_NAME_LIST_METADATA_KEY, nameList, target)

        if (ignore === true) {
            Reflect.defineMetadata(
                JSON_IGNORE_METADATA_KEY,
                ignore,
                target,
                propertyKey
            )
        }
    }
}

export const JSONData = function () {
    return function classDecorator<T extends { new (...args: any[]): {} }>(
        constructor: T
    ) {
        return class extends constructor {
            toJSON() {
                const copyOfThis: any = { ...this }
                const nameList:
                    | (string | symbol)[]
                    | undefined = Reflect.getMetadata(
                    JSON_NAME_LIST_METADATA_KEY,
                    this
                )
                // toJSON 输出 get 属性
                nameList &&
                    nameList.forEach((name) => {
                        copyOfThis[name] = (this as any)[name]
                    })

                Object.keys(this).forEach((key) => {
                    const ignore: boolean | undefined = Reflect.getMetadata(
                        JSON_IGNORE_METADATA_KEY,
                        this,
                        key
                    )
                    if (ignore === true) {
                        delete copyOfThis[key]
                    }
                })
                return copyOfThis
            }
        }
    }
}
