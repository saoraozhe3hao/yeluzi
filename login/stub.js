import Mock from 'mockjs'
var Random = Mock.Random;

var commonId = Random.integer(0);
function stub(){
    // 登录
    Mock.mock(/\/admin\/login/,function(){
        return {
            code: "0",
            data: {
                adminUserId: Random.integer(0),
                adminUserName: Random.pick(["张三", "李四", "王五",'赵六']),
                roleCode: 'CS_ADMIN',
                mobile: Random.integer(10000000000, 19999999999),
                position: "职位" + Random.integer(0),
                certId: Random.integer(0),
                certPic: Random.dataImage('178x178')
            }
        }
    });
}

export default stub;