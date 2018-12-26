import request from 'superagent';

request.get('https://github.com/NG-ZORRO/ng-zorro-antd/tree/master/components').end((err, res) => {
	console.log(err, res);
});
