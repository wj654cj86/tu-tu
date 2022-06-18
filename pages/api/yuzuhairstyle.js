var 髮型 = {
	短髮: 1,
	長髮: 4,
	馬尾: 4,
	雙馬尾: 4
};
let 總和 = 0;
for (let it in 髮型) {
	總和 += 髮型[it];
}
let 保底表 = [];
for (let it in 髮型) {
	for (let i = 0; i < 髮型[it]; i++) {
		保底表.push(it);
	}
}
let 順序 = 0;
function 洗牌() {
	for (let i = 0; i < 總和; i++) {
		let j = Math.floor(Math.random() * 總和);
		let t = 保底表[j];
		保底表[j] = 保底表[i];
		保底表[i] = t;
	}
}
洗牌();
export default async function handler(req, res) {
	let 抽髮型 = 保底表[順序++];
	if (順序 >= 總和) {
		順序 = 0;
		洗牌();
	}
	res.status(200).json(`今天柚子的髮型是${抽髮型}！`);
}
