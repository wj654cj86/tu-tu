import { createClient } from "@supabase/supabase-js";

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

function gettxtfile(url) {
	return new Promise((resolve, reject) => {
		fetch(url)
			.then((response) => {
				return response.text();
			})
			.then((text) => {
				resolve(text);
			});
	});
}

const 獎金 = 10000;

export default async function handler(req, res) {
	let { urlkey, key, streamer, player, playername, answer, token } = req.query;
	try {
		const supabase = createClient(
			`https://${urlkey}.supabase.co`,
			key
		);
		if (streamer === undefined || streamer == "") throw 'error';
		if (player === undefined || player == "") throw 'error';
		if (playername === undefined || playername == "") throw 'error';
		let { data } = await supabase.from("guess").select();
		let one = data.find(element => element.name == streamer);
		if (one === undefined) {
			one = { name: streamer, answer: 出題() };
			await supabase.from("guess").insert(one);
			data = (await supabase.from("guess").select()).data;
			one = data.find(element => element.name == streamer);
		}
		let 猜測 = answer;
		let 輸出 = '';
		let 答案 = one.answer;
		if (猜測 == 'null' || 猜測 == null) {
			輸出 = '你沒有給數字！';
		} else if (猜測.length != 4) {
			輸出 = '你給的數字有錯！';
		} else if (重複數字(猜測)) {
			輸出 = '你給到重覆數字，不給你提示！';
		} else {
			let a = 0, b = 0;
			for (let i = 0; i < 4; i++)
				if (猜測[i] == 答案[i])
					a++;

			for (let i = 0; i < 4; i++)
				for (let j = 0; j < 4; j++)
					if (猜測[i] == 答案[j])
						b++;
			b -= a;
			if (a != 0)
				輸出 += `${a}A`;
			if (b != 0)
				輸出 += `${b}B`;
			if (a == 0 && b == 0)
				輸出 += '0A';
			if (a == 4) {
				await supabase.from("guess").update({ answer: 出題() }).match({ name: streamer });
				輸出 = `恭喜${playername}猜中數字！獲得${獎金}喵喵幣！`;
				await gettxtfile(`https://api.jebaited.net/addPoints/${token}/${player}/${獎金}`);
			}
		}
		res.status(200).json(輸出);
	} catch (e) {
		res.status(200).json('error');
	}
}
