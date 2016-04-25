/**
 * Created by bartosz on 03.06.15.
 *
 * MainTestFlow class
 */
'use strict';

import ComponentRenderingTest from '../src/tests/layoutManager/ComponentRenderingTest';
import OptionRenderingTest from '../src/tests/layoutManager/OptionRenderingTest';
import PerspectiveRenderingTest from '../src/tests/layoutManager/PerspectiveRenderingTest';
import InteliUiFacade from '../src/tests/inteliUi/FacadeTest';
import InputAdapterTest from '../src/tests/inteliUi/InputConverterTest';
import OutputAdapterTest from '../src/tests/inteliUi/OutputConverterTest';
import InteliUiViewTest from '../src/tests/inteliUi/InteliUiViewTest';
import InteliUiWorkspaceRegisterTest from '../src/tests/inteliUi/InteliUiWorkspaceRegisterTest';
import SamilMainFlowTests from '../src/tests/samil/SamilMainFlowTests';
import SamilLayoutManagerTests from '../src/tests/samil/LayoutManagerTests';
import Profiles from '../src/Profiles';
import workspace from './front-end.hbs';

const TIME_OUT = 2000;

class TestExecutor {

    run() {
        $(document.body).append(workspace());
        if (Profiles.TEST !== ENV) {
            new InteliUiFacade().run();
        }
        new ComponentRenderingTest().run();
        new OptionRenderingTest().run();
        new PerspectiveRenderingTest().run();
        new InputAdapterTest().run();
        new OutputAdapterTest().run();
        new InteliUiViewTest().run();
        new InteliUiWorkspaceRegisterTest().run();
        new SamilMainFlowTests().run();
        new SamilLayoutManagerTests().run();
    }
}
export default TestExecutor;

describe('Start FRONTEND tests... ', function () {
    var testExecutor = new TestExecutor();

    testExecutor.run();

    it("showOption only failures", function () {

        if (getUrlParameter('error')) {
            setTimeout(function () {
                $(".failures").find("a")[0].click();
            }, TIME_OUT);
        }
        function getUrlParameter(sParam) {
            var sPageURL = window.location.search.substring(1);
            var sURLVariables = sPageURL.split('&');
            for (let i = 0; i < sURLVariables.length; i++) {
                let sParameterName = sURLVariables[i].split('=');
                if (sParameterName[0] == sParam) {
                    return sParameterName[1];
                }
            }
        }
    });

});

