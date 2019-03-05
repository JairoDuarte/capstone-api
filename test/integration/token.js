//var webdriver = require('selenium-webdriver');
import { Builder, By, Key, until } from 'selenium-webdriver';
import 'chromedriver';
import chrome from 'selenium-webdriver/chrome';
import http from 'http';
import app from '../../src/app.js';

class AuthenTest {

    constructor(app) {
        this.app = app;
        this.app = http.createServer(this.app);
        this.app.listen(0);
        this.port = this.app.address().port;
        this.coursier = { token: ' ', user: {}, done: false };
        this.customer = { token: ' ', user: {}, done: false };
    }
    set setcustomer(data) {
        this.customer.token = data.token;
        this.customer.user = data.user;
        //console.log(data.token ==! ' ');
        this.customer.done = true;
    }
    set setCoursier(data) {
        this.coursier.token = data.token;
        this.coursier.user = data.user;
        //console.log(data.token ==! ' ');
        this.coursier.done = true;
    }

    getcustomerToken() {
        return this.customer;
    }
    getCoursierToken() {
        return this.coursier;
    }
    async auth(role) {
        if (!this.coursier.done || !this.customer.done) {

            var options = await new chrome.Options().headless().addArguments('--no-sandbox');

            let driver = await new Builder().forBrowser('chrome')
                .setChromeOptions(options)
                .build();
            let data = {};

            try {
                await driver.get(`http://localhost:${this.port}/api/auth/signup`);
                await driver.wait(until.elementLocated(By.name('email')), 40000).sendKeys('tudosobre.com@gmail.com');
                await driver.findElement(By.name('email')).sendKeys(process.env.FB_USER_1_EMAIL);
                await driver.findElement(By.name('pass')).sendKeys(process.env.FB_USER_1_PWD, Key.RETURN);

                try {
                    let url = await driver.getCurrentUrl();
                    if (url.includes('api/auth/signin')) {
                        let response = await driver.findElement(By.xpath("//body/pre[1]")).getText();
                        data = JSON.parse(response);
                    }
                    else {
                        console.log('else');
                        let submitButton = await driver.findElement(By.id('platformDialogForm'))
                        await submitButton.submit();
                        let response = await driver.wait(until.elementLocated(By.xpath("//body/pre[1]")), 10000).getText();
                        data = JSON.parse(response);
                    }

                    if (role === 'customer') this.setcustomer = data;
                    else this.setCoursier = data;
                }
                catch (e) {
                    console.log(e);
                }
            } finally {
                await driver.quit();
            }
        }

    }
}

let auth = new AuthenTest(app);
Object.freeze(auth);

export default auth;