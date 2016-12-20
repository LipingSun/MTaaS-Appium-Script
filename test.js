require('colors');
var wd = require("wd");
var chai = require("chai");
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
var should = chai.should();
chaiAsPromised.transferPromiseness = wd.transferPromiseness;

describe("android test", function() {
    this.timeout(300000);
    var driver;
    var allPassed = true;

    before(function() {
        var server = {
            host: '127.0.0.1',
            port: 4723
        };
        driver = wd.promiseChainRemote(server);
        driver.on('status', function(info) { console.log(info.cyan); });
        driver.on('command', function(meth, path, data) { console.log(' > ' + meth.yellow, path.grey, data || ''); });
        driver.on('http', function(meth, path, data) { console.log(' > ' + meth.magenta, path, (data || '').grey); });

        var desired = {
            platformName: 'Android',
            // platformVersion: '2.3.3',
            udid: '0.tcp.ngrok.io:11363',
            deviceName: 'Android',
            app: "/home/ubuntu/appium-test/sample-code/apps/ApiDemos/bin/ApiDemos-debug.apk"
        }
        return driver.init(desired).setImplicitWaitTimeout(3000);
    });

    after(function() {
        return driver;
    });

    afterEach(function() {
        allPassed = allPassed && this.currentTest.state === 'passed';
    });

    it("should find an element", function() {
        return driver
            .elementByAccessibilityId('Graphics')
            .click()
            .elementByAccessibilityId('Arcs')
            .should.eventually.exist
            .back()
            .elementByName('App')
            .should.eventually.exist
            .elementsByAndroidUIAutomator('new UiSelector().clickable(true)')
            .should.eventually.have.length(12)
            .elementsByAndroidUIAutomator('new UiSelector().enabled(true)')
            .should.eventually.have.length.above(20)
            .elementByXPath('//android.widget.TextView[@text=\'API Demos\']')
            .should.exists;
    });
});
