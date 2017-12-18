# Nudgg API

## Running project

You need to have installed Node.js and MongoDB 

DataBase: mongodb://localhost:27017/nudgg

### Install dependencies 

To install dependencies enter project folder and run following command:
```
npm install
```

### Run server

To run server execute:
```
npm start 
```

### Make Requests

Server: http://34.252.122.16:1337

***** Creating user for nudgg: SignUp API
```
http POST /user/signup 
form parameters {
	firstName: 'required',
	lastName: 'required',
	email: 'required',
	dob: 'required',
	phoneNumber: 'optional',
	password: 'required'
}

return token

```
***** Resend email: Resend email API
```
http POST /user/resend 
Embedding token returned into the header or query after signup process
header['Authorization'] = token or /user/resend?Authorization=token

form parameters { email: email }
return token

```
***** login: Login API
```
http POST /user/login 

form parameters: {
	email: email,
	password: password
}

return token
```

***** Add Yodlee account: 
```
http POST /account/add 
header['Authorization'] = token or /account/add?Authorization=token
form parameters {
	user: {
		loginName: 'yslRest1233', 
		password: "Yodlee2233@@",
		email: "nudge@rose.com"
	}
}
return token

We need the yodlee user account to interact with youdlee site. Customer can look at the account list, once they have the yodlee user account as well as nudgg account.

```

***** Getting the fastLink to go to the add account journey 
```
http GET /account/fastlink 
including token: Authorization:'PUT_YOUR_TOKEN_HERE'
return fastlink as a json {fastlink: 'fastlink', rsession: 'userSessionToken', 'token': 'token', 'app': '10003600', redirectReq: true, extraParams: 'callbackUrl&siteAccountId=XX'}

Just embed the values returned from the request above into the form
	e.g. 
		<form action="fastlink" method="POST">
			<input type="text" name="app" value="app" />
			<input type="text" name="rsession" value="rsession" />
			<input type="text" name="token" value="token" />
			<input type="text" name="redirectReq" value="true" />
			<input type="text" name="extraParams" value="callback=http://localhost:1337/account/callback&siteAccountId=111" />
			<input type="submit" name="submit" value="connect account" /> 
		</form>
    when user click on the connect account button, it will be redirected to the add account journey, so we should get the fastlink before add account journey 

		Replace the callbackURL with your FE URL

	We can use following user credentials for test.
	yodlee username: ahgif.site16441.1
	yodlee password: site16441.1

```

***** Getting the balance and the list of accounts by the account type
```
http GET /account/balance Authorization:'PUT_YOUR_TOKEN_HERE'
return balance and the list of accounts by the type as a json {
	balance: {
		investment: investBalance,
		cash: cashBalance
	},
	acctList: {
		investment: invest,
		cash: cash
	}
}
```

***** Getting the list of accounts
```
http GET /account/list Authorization:'PUT_YOUR_TOKEN_HERE'
return the list of accounts as a json including account information 

e.g This is one account data. It would be sent to the server as a query param at every request
{ "CONTAINER": "bill", "providerAccountId": 10378836, "accountName": "DAG BILLING", "accountStatus": "ACTIVE", "accountNumber": "555555", "isAsset": false, "balance": { "amount": 1200, "currency": "USD" }, "id": 10838702, "lastUpdated": "2017-08-24T08:14:13Z", "frequency": "ANNUALLY", "providerId": "16441", "providerName": "Dag Site", "accountType": "BILLS", "amountDue": { "amount": 1200, "currency": "USD" }, "isManual": false, "createdDate": "2017-08-24T05:33:41Z", "refreshinfo": { "statusCode": 0, "statusMessage": "OK", "lastRefreshed": "2017-08-24T08:13:52Z", "lastRefreshAttempt": "2017-08-24T08:13:52Z", "nextRefreshScheduled": "2017-08-28T07:02:27Z" } }
```


***** Getting the transactions of a particular user.
```
http GET /account/transactions Authorization:'PUT_YOUR_TOKEN_HERE'

return transaction as a json {
	transaction: transaction
}

```
***** Getting the total number of transactions of a particular user.
```
http GET /account/transactions/count Authorization:'PUT_YOUR_TOKEN_HERE'

return number of transactions as a json {
	count: count
}

```
***** Getting the details of the account of a particular user.
```
http GET /account/details Authorization:'PUT_YOUR_TOKEN_HERE'

e.g This is details of the account

We can get the information like site name, favicon, logo, base url and so on here

return transaction as a json {
	details: details
}

```
***** Getting the details of the particular account details of a particular user.
```
http GET /account/provider Authorization:'PUT_YOUR_TOKEN_HERE'

query parameter: providerId = '1232'

e.g This is details of the one account

	We can get the information such as site name, favicon, logo, base url and so on here

return transaction as a json {
	detail: detail
}

```
***** Create a goal
```
http POST /goal/create Authorization: 'PUT_YOUR_TOKEN_HERE'

payload: 
{
	goalType: String, // should be one of "Travel", "A House", "A Car", "Other"
	goalName: String, // The length should be larger than(equal to) 5 characters and less than(equal to) 30 characters. 
	goalAmount: Number, // Integer, should be larger than 1.
}

return: 
SUCESS
{
	error: false,
	data: {}
}

FAIL
{
	error: true,
	data: {
		message: "Invalid goal type. please select goal type"
	}
}

```

***** Change Password endpoint
```
http POST /user/changePassword Authorization:'PUT_YOUR_TOKEN_HERE'

payload:
{
	password: String //new password, The password should contain a minimum of 8 characters, including at least 1 uppercase letter and 1 number 
}

return:
SUCCESS
{
	error: false,
	data:{}
}

FAILURE
{
    error: true,
    data: {
        message: "Your password should contain a minimum of 8 characters, including at least 1 uppercase letter and 1 number"
    }
}
```

***** Account activation API
```
http GET /user/activate?token = 'PUT_YOUR_TOKEN_HERE'

return:
SUCCESS
{
	error: false,
	data: {}
}
FAILURE
{
	error: true,
	data: {
		message: "DB Error"
	}
}

```

***** Forgotten Password API
```
http POST /user/forgotten

payload:
{
	email: email
}

return:
If success, send the email contains the link(/change-password/token) to the email address.

SUCCESS
{
	error: false,
	data: {}
}
FAILURE
{
	error: true,
	data: {
		message: "DB Error"
	}
}
```

***** Verify Token API
```
http POST /user/verifyToken  Authorization:'PUT_YOUR_TOKEN_HERE'

payload: n/a

return:

SUCCESS
{
	error: false,
	data: {
		"firstName": "Your name"
	}
}
FAILURE
{
    error: true,
    data: {
        "message": "Unauthorized"
    }
}
```
## Modules used

Some of non standard modules used:
* [express](https://www.npmjs.com/package/express)
* [mongoose](https://www.npmjs.com/package/mongoose)
* [nconf](https://www.npmjs.com/package/nconf)
* [winston](https://www.npmjs.com/package/winston)
* [nodemailer](https://www.npmjs.com/package/nodemailer)
* [request](https://www.npmjs.com/package/request)
* [nodemon](https://www.npmjs.com/package/nodemon)
* [lodash](https://www.npmjs.com/package/lodash)
* [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken)
* [helmet](https://www.npmjs.com/package/helmet)

