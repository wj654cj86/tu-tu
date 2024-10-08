import { createClient } from '@supabase/supabase-js';

function 出題() {
	let v = [];
	for (let i = 0; i < 10; i++) {
		v[i] = i;
	}
	for (let i = 0; i < 10; i++) {
		let j = Math.floor(Math.random() * 10);
		[v[i], v[j]] = [v[j], v[i]];
	}
	return v.join('').slice(0, 4);

}

function 重複數字(猜測) {
	for (let i = 0; i < 4; i++)
		for (let j = i + 1; j < 4; j++)
			if (猜測[i] == 猜測[j])
				return true;
	return false;
}

export default async function (req, res) {
	res.setHeader('Content-Type', 'text/plain; charset=utf-8');
	let { bonus, points, streamer, player, answer, token, urlkey, key } = req.query;
	try {
		const supabase = createClient(`https://${urlkey}.supabase.co`, key);
		let 獎金;
		let 點數;
		if (bonus === undefined || bonus == '' || bonus == '0') {
			獎金 = '0';
		} else {
			if (token === undefined || token == '') throw 'error';
			獎金 = bonus;
		}
		if (points === undefined || points == '') {
			點數 = '點';
		} else {
			點數 = points;
		}
		if (streamer === undefined || streamer == '') throw 'error';
		if (player === undefined || player == '') throw 'error';
		let { data } = await supabase.from('guess').select();
		let one = data.find(element => element.name == streamer);
		if (one === undefined) {
			one = { name: streamer, answer: 出題(), points: 點數 };
			await supabase.from('guess').insert(one);
			data = (await supabase.from('guess').select()).data;
			one = data.find(element => element.name == streamer);
		}
		let db_set = (data) => supabase.from('guess').update(data).match({ name: streamer });
		if (點數 == '點') {
			點數 = one.points;
		} else if (點數 == 'reset') {
			await db_set({ points: '點' });
			點數 = '點';
		} else {
			await db_set({ points: 點數 });
		}
		let 猜測 = answer;
		let 輸出 = '';
		let 答案 = one.answer;
		if (猜測 == 'null' || 猜測 == null) {
			輸出 = '你沒有給數字！';
		} else if (isNaN(猜測)) {
			輸出 = '別騙我，你給的不是數字！';
		} else if (猜測.length != 4) {
			輸出 = '你給的數字長度有錯！';
		} else if (重複數字(猜測)) {
			輸出 = '你給到重覆數字，不給你提示！';
		} else {
			let a = 0;
			for (let i = 0; i < 4; i++)
				if (猜測[i] == 答案[i])
					a++;
			let b = -a;
			for (let i = 0; i < 4; i++)
				for (let j = 0; j < 4; j++)
					if (猜測[i] == 答案[j])
						b++;
			if (a != 0)
				輸出 += `${a}A`;
			if (b != 0)
				輸出 += `${b}B`;
			if (a == 0 && b == 0)
				輸出 += '0A';
			if (a == 4) {
				await db_set({ answer: 出題() });
				if (獎金 == '0') {
					輸出 = `恭喜你猜中數字！`;
				} else {
					輸出 = `恭喜你猜中數字！獲得${獎金}${點數}！`;
					await fetch(`https://api.jebaited.net/addPoints/${token}/${player}/${獎金}`);
				}
			}
		}
		res.status(200).send(輸出);
	} catch (e) {
		res.status(200).send('指令出錯，請聯絡管理員！');
	}
}
