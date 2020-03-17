const test = require('ava');

const { default: a } = require('../dist/index');

test('用户名+设备ID登录', async (t) => {
	const ran44 = await a('taoqiufeng', 'taoqf001', 'taoqf', '127.0.0.1');
	t.is(ran44.userid, 'taoqiufeng');
});
