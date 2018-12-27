// 文档
export interface Doc {
    category: string;
    subtitle: string;
    type: string;
    title: string;
    // 何时使用
    whenUse: string;
    // 描述
    desc: string;
    // api列表
    apis: Api[];
    // 地址
    cnAddress: string;
    enAddress: string;
}

// API
export interface Api {
    // 词缀
    affix: string;
    // 类型
    type: string;
    // 属性列表
    props: Prop[];
    // 属性列表说明
    template: Template[];
}

// 属性
export interface Prop {
    // 名称
    name: string;
    // 描述
    desc: string;
    // 类型
    type: string;
    // 可选值
    chooseValue: string;
    // 默认值
    defaultValue: string;
}


// 属性列表说明
export interface Template {
    // 描述
    desc: string;
    // 代码
    code: string;
}

