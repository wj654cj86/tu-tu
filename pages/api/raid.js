export default async function (req, res) {
	let { name } = req.query;
	let 帳號 = '';
	let 暱稱 = '';
	if (name.indexOf('(') != -1) {
		let 陣列 = name.split(/[\(\)]/).map(v => v.trim());
		帳號 = 陣列[1].toLowerCase();
		暱稱 = 陣列[0];
	} else {
		帳號 = name.toLowerCase();
		暱稱 = name;
	}
	res.status(200).json({ 暱稱, 帳號 });
}
