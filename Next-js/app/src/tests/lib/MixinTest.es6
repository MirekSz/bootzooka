import * as mixin from '../../lib/Mixins';
/**
 * Created by Mirek on 2015-07-01.
 */
class Demo {
    constructor() {
        mixin.mixinInitializer(this);
    }
}

class DemoWithOptions {
    constructor() {
        mixin.mixinInitializer(this, {sufix: '!!!'});
    }
}

class MixinTest {

    run() {
        describe('Start mixin tests..', function () {
                it("should extend class of hello mixinx", function () {
                    //given
                    mixin.applyMixin(mixin.helloMixin, Demo);
                    var demo = new Demo();

                    //then
                    var hello = demo.hello();

                    //then
                    expect(hello).to.not.undefined;
                });

                it("should extend class of hello mixinx and call initializing function", function () {
                    //given
                    mixin.applyMixin(mixin.helloMixin, Demo);
                    var demo = new Demo();


                    //then see constructor
                    var hello = demo.hello();

                    //then
                    expect(hello).to.be.eq('Hello World');
                });

                it("should extend class of hello mixinx and call initializing function and pass param to it", function () {
                    //given
                    mixin.applyMixin(mixin.helloMixin, DemoWithOptions);
                    var demo = new DemoWithOptions();


                    //then see constructor
                    var hello = demo.hello();

                    //then
                    expect(hello).to.be.eq('Hello World !!!');
                });

            }
        );
    }
}


export default MixinTest;
