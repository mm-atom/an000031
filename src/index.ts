import { createHash } from 'crypto';
import an29, { IUserInfo } from '@mmstudio/an000029';
import an14 from '@mmstudio/an000014';
import { v4 as uuid } from 'uuid';

const db = 'sys';

/**
 * 使用手机号+设备ID登录
 */
export default async function login(usr: string, psw: string, token: string, ip: string) {
	const userinfo = await an29(usr, psw, ip);
	if (userinfo) {
		const sql = `select id from user_auths where identity_type='rememberme' and identifier='${usr}'`;
		const [ran14] = await an14<IUserInfo>(db, [sql, []]);
		const now = new Date().getTime();
		if (ran14.length === 0) {
			// insert
			await an14<IUserInfo>(db, [`insert into user_auths (id,user_id,identity_type,identifier,credential,last_active,ip) values ('${uuid()}','${userinfo.id}','rememberme','${usr}','${md5(token)}', ${now},'${ip}')`, []]);
		} else {
			// update
			await an14<IUserInfo>(db, [`update user_auths set ip='${ip}',last_active=${now},credential='${md5(token)}' where identity_type='rememberme' and identifier='${usr}'`, []]);
		}
	}
	return userinfo;
}

/**
 * md5加密
 * @param algorithm 算法 md5
 * @see 文档：<http://nodejs.cn/api/crypto.html#crypto_crypto_createhash_algorithm_options>
 * @param content 内容
 */
function md5(content: string) {
	return createHash('md5').update(content).digest('hex');
}
