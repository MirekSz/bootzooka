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

        describe('Start OptionDefTest...', function () {

                const ID_TABLE_VIEW = 'IdTableView';

                let customerBuyerView = new ViewComponentDef(ID_TABLE_VIEW);
                let customerSellerView = new ViewComponentDef(ID_TABLE_VIEW);
                var inOptionId1 = '1';
                var inOptionId2 = '2';

                const CUSTOMER_OPTION = 'CustomerOption';


                it('should add two views of the same definitions', function () {
                    //given
                    var optionDef = new OptionDef({
                        id: CUSTOMER_OPTION
                    });

                    optionDef.addViewDef(customerBuyerView, inOptionId1);
                    optionDef.addViewDef(customerSellerView, inOptionId2);

                    //when
                    var viewDefMap = optionDef.getViewDefMap();
                    var viewDefList = optionDef.getViewDefList();

                    //then
                    expect(viewDefMap.size).to.be.eq(2);
                    expect(viewDefList).to.have.length(2);

                });


                it('should getView method return view by unique id', function () {
                    //given
                    var optionDef = new OptionDef({
                        id: CUSTOMER_OPTION
                    });
                    optionDef.addViewDef(customerBuyerView, inOptionId1);
                    optionDef.addViewDef(customerSellerView, inOptionId2);

                    //when
                    var view1 = optionDef.getViewDef(inOptionId1);
                    var view2 = optionDef.getViewDef(inOptionId2);
                    //then
                    expect(customerBuyerView).to.be.eq(view1);
                    expect(customerSellerView).to.be.eq(view2);
                });
                it('should throw exception when try add component with same id', function () {
                    //given
                    var optionDef = new OptionDef({
                        id: CUSTOMER_OPTION
                    });
                    optionDef.addViewDef(customerBuyerView, inOptionId1);

                    var exception;
                    //when
                    try {
                        optionDef.addViewDef(customerBuyerView, inOptionId1);
                    } catch (e) {
                        exception = e;
                    }

                    //then
                    expect(exception).to.not.undefined;

                });

            }
        );
    }
}

export default OptionDefTest;
