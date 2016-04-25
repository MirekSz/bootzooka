import ViewComponentDef from '../../componentsDefinitions/ViewComponentDef';
import Assertions from '../../lib/Assertions';
/**
 * Created by Mirek on 2015-06-06.
 */
class AssertionsTest {

    run() {
        describe('Start assertions tests..', function () {
                it("should reject object without id", function () {
                    const empty = {};
                    var exception;
                    try {
                        Assertions.required(empty, empty.id);
                    } catch (e) {
                        exception = e;
                    }
                    expect(exception).to.not.undefined;
                });

                it("should accept object with required id", function () {
                    const empty = {id: 10};
                    Assertions.required(empty.id);

                });

                it("should reject wrong object type", function () {
                    const empty = {};
                    var exception;
                    try {
                        Assertions.type(empty, ViewComponentDef);

                    } catch (e) {
                        exception = e;
                    }
                    expect(exception).to.not.undefined;

                });

                it("should accept  object with correct type", function () {
                    const empty = new ViewComponentDef(1, 2);
                    Assertions.type(empty, ViewComponentDef);

                });
                it("promise test", function (done) {
                    Assertions.promise().then(function (data) {
                        try {
                            expect(data).to.be.eq(4);
                            done();
                        } catch (e) {
                            done(e);
                        }
                    })

                });
            }
        );
    }
}

export default AssertionsTest;
