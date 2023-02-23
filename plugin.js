// JSON解析插件，将设备编码数据解析为统一数据信息
let hohux = {
    name: 'JSON',  // 插件名称，与插件管理中的名称一致
    version: 'v0.0.2', // 插件版本号，与插件管理中的插件版本号一致
    appid: '',
    secret: '',

    // 解码，将设备上传的数据，解析为HoHux统一数据结构
    // info 设备信息
    // sensors 传感器信息
    // msg 设备消息
    decode: function (info, sensors, msg) {
        // 解析后的传感器数据
        let deviceSensors = []

        // 将JSON字符串转为JSON
        let parse = JSON.parse(msg);

        // 设备消息的key=传感器编码，循环匹配，将解析后的数据存入到deviceSensors
        sensors.forEach(sensor => {
            for (let key in parse) {
                if (sensor.sensorCode === key) {
                    sensor.value = parse[key];
                    deviceSensors.push(sensor);
                }
            }
        })

        // 返回解析后的传感器数据
        return deviceSensors
    },

    //译码
    // info 设备信息
    // sensors 传感器信息
    // msg 设备消息
    //译码，将HoHux传输给设备的数据，解析为设备能识别的数据结构
    encode: function (info, sensors, msg) {

        // 发给设备的指令
        let instruction;

        // 将指令转换为JSON格式
        sensors.forEach(sensor => {
            if (sensor.sensorId === msg.sensorId) {
                instruction = {
                    [sensor.sensorCode]: msg.instruction
                }
            }
        })

        // 如果instruction指令时JSON对象时，需要转成JSON字符串，使用JSON.stringify(cmd)方法
        return {sensorId: msg.sensorId, instruction: JSON.stringify(instruction), commandType: msg.type}
    }
};

module.exports = hohux;
