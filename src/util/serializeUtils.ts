type JSONFieldParamter = { name?: string; ignore?: boolean }

const JSON_NAME_METADATA_KEY = Symbol("json-name-key")
const JSON_IGNORE_METADATA_KEY = Symbol("jsno-ignore-key")

// 实现 JSONField 控制 json 序列化过程
export const JSONField = function (
    params: JSONFieldParamter = {}
): PropertyDecorator {
    return (target: any, propertyKey: string | symbol) => {
        const { name, ignore } = params
        if (name) {
            Reflect.defineMetadata(
                JSON_NAME_METADATA_KEY,
                name,
                target,
                propertyKey
            )
        }
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
                for (let key in this) {
                    const name: string | undefined = Reflect.getMetadata(
                        JSON_NAME_METADATA_KEY,
                        this,
                        key
                    )
                    const ignore: boolean | undefined = Reflect.getMetadata(
                        JSON_IGNORE_METADATA_KEY,
                        this,
                        key
                    )
                    if (name) {
                        copyOfThis[name] = this[key]
                        delete copyOfThis[key]
                    }

                    if (ignore === true) {
                        delete copyOfThis[key]
                    }
                }
                return JSON.stringify(copyOfThis)
            }
        }
    }
}

// TODO JSONData json 输出 get 属性
