/**
 * Created by bartosz on 03.06.15.
 *
 * MainTestFlow class
 */
import ElementFactoryTest from './../src/tests/components/ComponentFactoryTest';
import CompositionFactoryTest from './../src/tests/factories/CompositeComponentFactoryTest';
import ComponentDataProviderForTest from './../src/tests/providers/ComponentDataProviderForTest';
import PerspectiveFactoryTest from './../src/tests/factories/PerspectiveFactoryTest';
import MultiCommunicationTest from './../src/tests/components/MultiCommunicationTest';
import ComponentTest from './../src/tests/components/ComponentTest';
import TreeComponentTest from './../src/tests/components/tree/TreeComponentTest';
import TreeRowSelectorTest from './../src/tests/components/tree/TreeRowSelectorTest';
import AssertionsTest from './../src/tests/lib/AssertionsTest';
import MixinTest from './../src/tests/lib/MixinTest';
import CommunicationFactoryTest from './../src/tests/communication/CommunicationFactoryTest';
import ComponentDefinitionRegistryTest from './../src/tests/componentsDefinitions/ComponentDefinitionRegistryTest';
import OptionDefinitionRegistryTest from './../src/tests/compositeComponentsDefinitions/OptionDefinitionRegistryTest';
import OptionDefTest from './../src/tests/compositeComponentsDefinitions/OptionDefTest';
import OptionTest from './../src/tests/compositeComponentsDefinitions/OptionTest';
import TreeDataProviderTest from './../src/tests/dataProviders/TreeDataProviderTest';
import ServiceMethodInvokerTest from './../src/tests/components/action/ServiceMethodInvokerTest';
import LogicalLockServiceTest from './../src/tests/vedas/LogicalLockServiceTest';
import ServiceCommandTest from './../src/tests/components/action/ServiceCommandTest';
import WorkbenchTest from './../src/tests/workbench/WorkbenchTest';
import BindHandlerTests from './../src/tests/samil/bindHandler/BindHandlerTests';
import DataSetTests from './../src/tests/vedas/DataSetTests';
import ValidationTests from './../src/tests/vedas/ValidationTests';
import WindowTests from './../src/tests/sidow/WindowTests';
import WindowManagerTest from './../src/tests/sidow/WindowManagerTest';
import TabWindowManagerTest from './../src/tests/sidow/TabWindowManagerTests';

class TestExecutorBackend {

    run() {
        global.testEnviroment = true;

        let componentDataProvider = ComponentDataProviderForTest.create();

//        new AssertionsTest().run();
//        new ElementFactoryTest().run();
//        new CompositionFactoryTest().run(componentDataProvider);
//        new ComponentTest().run();
//        new PerspectiveFactoryTest().run(componentDataProvider);
//        new MultiCommunicationTest().run();
//        new CommunicationFactoryTest().run();
//        new ComponentDefinitionRegistryTest().run();
//        new OptionDefinitionRegistryTest().run();
//        new OptionDefTest().run(componentDataProvider);
//        new OptionTest().run();
//        new MixinTest().run();
//        new TreeDataProviderTest().run();
//        new TreeComponentTest().run();
//        new WorkbenchTest().run();
//        new TreeRowSelectorTest().run();
//        new BindHandlerTests().run();
//        new DataSetTests().run();
//        new ValidationTests().run();
        new WindowTests().run();
//        new ServiceMethodInvokerTest().run();
//        new ServiceCommandTest().run();
//        new WindowManagerTest().run();
//        new TabWindowManagerTest().run();

        console.log('Unit tests ended...');
    }
}

export default TestExecutorBackend;

describe('Start UNIT tests...', function () {

    var testExecutorBackend = new TestExecutorBackend();

    testExecutorBackend.run();
});
