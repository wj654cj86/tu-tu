export default async function handler(req, res) {
	let { name } = req.query;
	let 帳號 = '';
	let 暱稱 = '';
	if (name.indexOf('(') != -1) {
		let 括弧 = name.indexOf(' (');
		帳號 = name.substr(括弧).replace(' (', '').replace(')', '').toLowerCase();
		暱稱 = name.substr(0, 括弧);
	} else {
		帳號 = name.toLowerCase();
		暱稱 = name;
	}
	res.status(200).json(`{'account':'${暱稱}','nickname':'${帳號}'}`);
}
