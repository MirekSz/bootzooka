'use strict';
import communicationFactory from '../../communication/CommunicationFactory';
import Socket,{DEFAULT_SOCKET_DELAY} from '../../communication/Socket';
import ConnectionDef from '../../communication/ConnectionDef';
import SocketDef from '../../communication/SocketDef';
import Globals from '../../enums/GlobalEnums';
import {wait} from '../TestingTools';

class communicationFactoryTest {

    run() {

        describe('Start communicationFactoryTest..', function () {
            let expect = require('chai').expect;

            var inSocketDef = new SocketDef(Globals.ID_BEAN, 'IDCustomer');
            var outSocketDef = new SocketDef(Globals.ID_BEAN, 'IDCustomer');

            var inSocket = new Socket(inSocketDef);
            var outSocket = new Socket(outSocketDef);
            var connDef = new ConnectionDef(1, 2, 3, 4);

            describe('socket creator test', function () {
                it('should create ready to use socket ', function () {
                    //when
                    var inSocket = new Socket(inSocketDef);

                    //then
                    expect(inSocket.isReady()).to.be.true;

                });

                it('should create not ready to use socket - required socket dosent have value', function () {
                    //when
                    var inSocket = new Socket(new SocketDef(Globals.ID_BEAN, 'IDCustomer', true));

                    //then
                    expect(inSocket.isReady()).to.be.false;

                });

                it('should create  ready to use socket - required socket has value', function () {
                    //given
                    var inSocket = new Socket(new SocketDef(Globals.ID_BEAN, 'IDCustomer', true));

                    //when
                    inSocket.send('Some data');

                    //then
                    expect(inSocket.isReady()).to.be.true;

                });
            });


            it('should create connection with socekts same type ', function () {

                var listener = communicationFactory.createConnection(inSocket, outSocket, connDef);

                expect(listener).not.be.undefined;

            });
            it('should not create connection twice ', function () {
                var exception;
                try {
                    var listener = communicationFactory.createConnection(inSocket, outSocket, connDef);
                } catch (e) {
                    exception = e;
                }
                expect(exception).not.be.undefined;

            });
            it('should not create connection with socekts different type ', function () {
                var outSocketDef = new SocketDef(Globals.ID_BEAN, 'IdOperator');
                var outSocket = new Socket(outSocketDef);
                var exception
                try {
                    var listener = communicationFactory.createConnection(inSocket, outSocket, connDef);
                } catch (e) {
                    exception = e;
                }
                expect(exception).not.be.undefined;

            });


            it("delayed socket drop previus messages", function (done) {
                var counter = 0;
                var lastValue = 0;
                inSocket.delayed = true;
                inSocket.addListener(new ConnectionDef(1, 2, 3, 4), (data)=> {
                    counter++;
                    lastValue = data;
                });

                //when
                for (let i = 0; i <= 10; i++) {
                    inSocket.send(i);
                }

                //then
                wait(()=> {
                    expect(counter).to.be.eq(1);
                    expect(lastValue).to.be.eq(10);
                }, done, DEFAULT_SOCKET_DELAY * 2);
            });
        });

    }

}

export default communicationFactoryTest;

