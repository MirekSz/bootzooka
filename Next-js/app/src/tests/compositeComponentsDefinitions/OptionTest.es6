/**
 * Created by bartosz on 03.06.15.
 *
 * CompositionFactoryTest class
 */
import OptionDef from '../../compositeComponentsDefinitions/OptionDef';
import CompositionFactory from '../../compositeComponents/TestCompositionFactory';
import PortalDef from '../../compositeComponentsDefinitions/PortalDef';
import Globals from '../../enums/GlobalEnums';
import ConnectionDef from '../../communication/ConnectionDef';
import GridPosition from '../../components/GridPosition';
import Types from '../../enums/ComponentsDefinitionsTypes';
import ViewComponentDef from '../../componentsDefinitions/ViewComponentDef';

class OptionDefTest {

    run() {
        let expect = require('chai').expect;

        describe('Start OptionTest...', function () {

                const ID_TABLE_VIEW = 'IdTableView';

                let customerBuyerView = new ViewComponentDef(ID_TABLE_VIEW);
                let customerSellerView = new ViewComponentDef(ID_TABLE_VIEW);

                const CUSTOMER_OPTION = 'CustomerOption';


                var optionDef = new OptionDef({
                    id: CUSTOMER_OPTION
                });
                var inOptionId1 = '1';
                var inOptionId2 = '2';
                optionDef.addViewDef(customerBuyerView, inOptionId1);
                optionDef.addViewDef(customerSellerView, inOptionId2);

                it('should create option from def with two views', function () {
                    //given
                    var option = CompositionFactory.createOption(optionDef);

                    //when
                    var views = option.getViews();

                    //then
                    expect(views).to.have.length(2);
                });


                it('should return components by id', function () {
                    //given
                    var option = CompositionFactory.createOption(optionDef);

                    //when
                    var view = option.getComponent(inOptionId1);

                    //then
                    expect(view).to.not.undefined;
                });
            }
        );
    }
}

export default OptionDefTest;
