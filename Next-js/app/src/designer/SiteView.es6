/**
 * Created by bartosz on 18.09.15.
 *
 * SiteView class
 */
import site from './Site';
import Controller from './SiteController';
import {jQueryEventRegistry} from '../lib/JQueryEventsClass';
import PortalDef from '../compositeComponentsDefinitions/PortalDef';
import PortalActionDef from '../compositeComponentsDefinitions/PortalActionDef';
import portalDefinitionRegistry from '../compositeComponentsDefinitions/PortalDefinitionRegistry';
import optionDefinitionRegistry from '../compositeComponentsDefinitions/OptionDefinitionRegistry';
import PageElement from './models/PageElement';
import ContentManager from './ContentManager';
import PortalsContentManager from '../portals/PortalsContentManager';
import PortalsDesignerView from '../portals/PortalsDesignerView';
import {eventBus, events} from '../lib/EventBus';
import TestRegistry from '../tests/ajaxCommunication/TestRegistry';
import rendering from '../lib/rendering/RenderingProperties';

import SidebarManager from '../sidow/sidebarManager/SidebarManager';
import SidebarElement from '../sidow/sidebarManager/SidebarElement';
import inteliUiSample from '../samples/inteliUi/InteliUiSample';
import InteliUi from '../inteliUi/InteliUi';
import {showPortal} from '../samples/portal/PortalSample';
import {showTable} from '../samples/view/TableSample';
import {showTree} from '../samples/view/TreeSample';
import {show} from '../samples/Worksheet';
import {showBindingHandler} from '../samples/samil/bindingHandler/BindingHandlerSample';
import {actionSampleHandler} from '../samples/actions/ActionsSample';
import {showWindowSample} from '../samples/window/WindowSample';
import {showModalWindowSample} from '../samples/window/ModalWindowSample';
import {windowManagerSampleHandler} from '../samples/window/WindowManagerSample';

class SiteView {

    constructor() {
        this.defaultPortalName = 'Wybierz portal';
    }

    /**
     * Universal method to add panel to the dashboard
     *
     * @param panelModel
     * @param targetContainer
     * @param panelHandlers
     */
    renderPanel(panelModel, targetContainer, panelHandlers) {
        var self = this;
        var panelTemplate = require('./templates/elements/panel.hbs');

        targetContainer.html(panelTemplate(panelModel)).promise().done(() => {
            targetContainer.find('.panel-body').html(panelModel.body).promise().done(() => {
                panelHandlers(targetContainer, panelModel);

                self.showPanel(targetContainer);
            });
        });
    }

    /**
     * Standard set of handlers for panel element
     *
     * @private
     */
    showPanel(targetContainer) {
        var self = this;
        var $panel = targetContainer.find('.panel');

        setTimeout(() => {
            $panel.removeClass('beforeAnimation');
        }, 500);

        self.handleStandardPanelBehavior($panel);
    }

    /**
     * Universal method the dispose the panel
     *
     * @param $panel
     */
    disposePanel($panel) {
        var $panelRow = $panel.closest('.row');
        var panelRowElements = this.getPanelRowElements($panelRow);

        $panel.addClass('beforeAnimation');

        setTimeout(() => {
            $panel.parent().addClass('hidden');

            if (panelRowElements.length > 0) {
                var panelClassList = $panel.closest('.animated-panel').attr('class').split(' ');

                for (var i = 0; i < panelClassList.length; i++) {
                    var classElement = panelClassList[i];

                    if (classElement.indexOf('col-lg-') > -1) {
                        $panel.closest('.animated-panel').removeClass(classElement);
                    }
                }
            }
        }, 500);
    }

    /**
     * Universal method to show/hide panel
     *
     * @param $panel
     */
    showHidePanel($panel, $showHideBtn) {
        var icon = $showHideBtn.find('i');
        $panel.find('.collapse-wrapper').collapse('toggle');
        $panel.find('.panel-heading').toggleClass('border-left');

        if (icon.hasClass('fa-chevron-up')) {
            icon.removeClass('fa-chevron-up');
            icon.addClass('fa-chevron-down');
        } else {
            icon.removeClass('fa-chevron-down');
            icon.addClass('fa-chevron-up');
        }
    }

    /**
     * Get the panel row elements
     *
     * @param $panelRow
     * @return array panelRowElements
     */
    getPanelRowElements($panelRow) {
        return $panelRow.find('.panel');
    }

    /**
     * Method to change the portal name
     *
     * @param newName
     */
    changePortalName(newName) {
        var $portalName = $('#portal-selector').find('.dropdown-toggle');

        if (newName) {
            $portalName.text(newName);
        } else {
            $portalName.text(this.defaultPortalName);
        }
    }

    /**
     * Method to clear the side bar
     *
     * @returns {boolean}
     */
    clearSideBar() {
        var $sideBarMenu = $('#sidebar-wrapper').find('ul').find('li');

        for (var i = 0; i < $sideBarMenu.length; i++) {
            var $sideBarMenuEl = $($sideBarMenu[i]);

            if ($sideBarMenuEl.hasClass('option-element')) {
                $sideBarMenuEl.remove();
            }

            if (!$sideBarMenuEl.hasClass('always-visible')) {
                $sideBarMenuEl.remove();
            }

        }

        return true;
    }

    /**
     * Method to clear the main directory
     */
    clearWorkspace() {
        var destinationNode = $('#page-content-wrapper').find('.container-fluid');

        destinationNode.html('');
    }

    /**
     * Method to restore default side bar
     *
     * @returns {boolean}
     */
    restoreDefaultSideBar() {
        this.clearSideBar();

        var $sideBarMenu = $('#sidebar-wrapper').find('ul').find('li');

        for (var i = 0; i < $sideBarMenu.length; i++) {
            var $sideBarMenuEl = $($sideBarMenu[i]);

            if ($sideBarMenuEl.hasClass('standard-element')) {
                $sideBarMenuEl.removeClass('hidden');
            }
        }

        return true;
    }

    /**
     * Universal method to add the sidebar element
     *
     * @param args
     */
    createSidebarElement(args) {
        let $sideBarMenu = $('#sidebar-wrapper').find('ul.sidebar-elements');
        let sidebarTemplate = require('./templates/sidebar_element.hbs');

        if (!args.animationClass) {
            args.animationClass = 'hvr-bubble-float-right';
        } else {
            if (args.animationClass === 'none') {
                args.animationClass = 'no-animation';
            }
        }

        $sideBarMenu.append(
            $('<li>').append(
                $('<a>').attr('id', args.id)
                    .attr('class', `menu-element ${args.classes} ${args.animationClass}`)
                    .attr('href', '#')
                    .append(
                        $('<span>').addClass(args.icon),
                        $('<a>').addClass('menu-text').append(args.text)
                    )
            )
        );

        args.handler({page: args.page, element: $(`#${args.id}`)});
    }

    /**
     * Method to show already added element
     *
     * @param element
     * @returns {boolean}
     */
    showSideBarElement(element) {
        var elementToFindId = $('#' + element.id).closest('li').find('a').attr('id');
        var $sideBarMenu = $('#sidebar-wrapper').find('ul').find('li');

        for (let i = 0; i < $sideBarMenu.length; i++) {
            let $sideBarMenuEl = $($sideBarMenu[i]);
            let sideBarMenuElId = $sideBarMenuEl.find('a').attr('id');

            if (sideBarMenuElId === elementToFindId) {
                $sideBarMenuEl.removeClass('hidden');
            }
        }

        return true;
    }

    showQuestion(options) {
        var $optionsContainer = options.container;
        var $panel = $optionsContainer.find('.panel-default');
        var questionTemplate = require('./templates/question_panel.hbs');
        var model = options.model || {};
        var context = model.context;
        var portalId = model.portalId;

        $panel.addClass('hidden');

        $optionsContainer.append(questionTemplate(model)).promise().done(() => {
            var $questionContainer = $optionsContainer.find('.question-container');

            var positiveBtn = $optionsContainer.find('.positive-button');
            var negativeBtn = $optionsContainer.find('.negative-button');

            $optionsContainer.addClass('question-row');

            positiveBtn.click(() => {
                $optionsContainer.removeClass('question-row');

                $questionContainer.remove();
                $panel.removeClass('hidden');

                options.positiveFlow(options.container, context, portalId);
            });

            negativeBtn.click(() => {
                $optionsContainer.removeClass('question-row');

                $questionContainer.remove();
                $panel.removeClass('hidden');
            });
        });
    }

    showPortalSelector(response, $portalSelector) {
        var dropDownMenu = $portalSelector.find('#portal-dropdown-menu');
        var body = this.createPortalsList(response);

        dropDownMenu.append(body);
        dropDownMenu.removeClass('hidden');

        setTimeout(() => {
            dropDownMenu.toggleClass('not-visible');
        }, 200);

        $portalSelector.find('.dropdown:first').toggleClass('open');
    }

    hidePortalSelector($portalSelector) {
        var dropDownMenu = $portalSelector.find('#portal-dropdown-menu');

        dropDownMenu.find('.portal-selector-element').remove();
        dropDownMenu.toggleClass('not-visible');

        setTimeout(() => {
            dropDownMenu.toggleClass('hidden');
        }, 500);

        $portalSelector.find('.dropdown:first').toggleClass('open');
    }

    createPortalsList(response) {
        var self = this;
        var body = [];

        response.forEach(portalDef => {
            var controller = new Controller();

            if (controller.isPortalAllowedForUser(portalDef.id)) {
                let li = $('<li class="portal-selector-element">');
                let row = li.html(`<a href="#">${portalDef.name}</a>`);

                row.click(() => {
                    self.changePortalName(portalDef.id);

                    portalDefinitionRegistry.getPortalById(portalDef.id).then(data => {
                        var portalDefinition = new PortalDef({id: data.id});
                        var requestsArray = [];
                        var groupsMap = new Map();

                        data.actions.forEach(action => {
                            requestsArray.push(optionDefinitionRegistry.getPlatformOptionById(action.optionId));

                            groupsMap.set(action.optionId, action.groupName);
                        });

                        Promise.all(requestsArray).then(res => {
                            res.forEach(element => {
                                var portalActionDef = new PortalActionDef(element.id, element);

                                portalActionDef.setGroup(groupsMap.get(element.id));

                                portalDefinition.addActionDef(portalActionDef);

                                portalDefinition.setGroupMap(portalActionDef.group, portalActionDef.idOption);
                            });

                            site.showPortal(portalDefinition);
                        });
                    });
                });

                body.push(row);
            }
        });

        return body;
    }

    disposePortal(portal) {
        portal.dispose();

        this.clearSideBar();
        this.clearWorkspace();
    }

    renderPortal(portal) {
        var $mainScreen = $('#page-content-wrapper').find('.container-fluid');
        var $sideBarMenu = $('#sidebar-wrapper').find('ul.sidebar-elements');

        this.clearSideBar();
        this.clearWorkspace();

        portal.renderTo({target: $sideBarMenu, contentTarget: $mainScreen});
    }

    setPortalDefaultSideBar() {
        var self = this;

        this.clearSideBar();

        var dashboardExampleButton = {
            id: 'site-menu-dashboard',
            icon: 'fa fa-desktop',
            text: 'Dashboard',
            handler: self.siteMenuHandlers
        };

        var tableExampleButton = {
            id: 'site-menu-table',
            icon: 'fa fa-table',
            text: 'Tabela',
            handler: self.siteMenuHandlers
        };

        var formExampleButton = {
            id: 'site-menu-form',
            icon: 'fa fa-sticky-note-o',
            text: 'Formularz',
            handler: self.siteMenuHandlers
        };

        var sandboxExampleButton = {
            id: 'site-menu-sandbox',
            icon: 'fa fa-cubes',
            text: 'Samples',
            handler: self.siteMenuHandlers
        };

        this.createSidebarElement(dashboardExampleButton);
        this.createSidebarElement(tableExampleButton);
        this.createSidebarElement(formExampleButton);
        this.createSidebarElement(sandboxExampleButton);

        if (window.user.isAdmin) {
            var designerExampleButton = {
                id: 'site-menu-designer',
                icon: 'fa fa-cog',
                text: 'Designer',
                classes: 'bottom-align',
                animationClass: 'none',
                handler: self.siteMenuHandlers
            };

            this.createSidebarElement(designerExampleButton);
        }

    }

    setSandboxSideBar() {
        var sidebarElements = [];
        this.clearSideBar();

        let inteliUiBtn = new SidebarElement('inteliUi-modal-sample', inteliUiSample.showInteliUi, {text: 'InteliUi'});
        let showPortalBtn = new SidebarElement('showPortal-sample', showPortal, {text: 'Portal'});
        let showTreeBtn = new SidebarElement('showTree-sample', showTree, {text: 'Tree'});
        let showTableBtn = new SidebarElement('showTable-sample', showTable, {text: 'Table'});
        let showWorksheetBtn = new SidebarElement('showSamilEditor-sample', show, {text: 'Worksheet'});
        let showBindingHandlerBtn = new SidebarElement('showBindingHandler-sample', showBindingHandler, {text: 'BindHandler'});
        let actionsBtn = new SidebarElement('showActions-sample', actionSampleHandler, {text: 'Actions'});
        let showWindowBtn = new SidebarElement('window-sample', showWindowSample, {text: 'Window'});
        let showWindowSampleBtn = new SidebarElement('modalWindow-sample', showModalWindowSample, {text: 'Modal Window'});
        let showWindowManagerSampleBtn = new SidebarElement('window-manager-sample', windowManagerSampleHandler, {text: 'Window Manager'});

        sidebarElements.push(inteliUiBtn);
        sidebarElements.push(showPortalBtn);
        sidebarElements.push(showTreeBtn);
        sidebarElements.push(showTableBtn);
        sidebarElements.push(showWorksheetBtn);
        sidebarElements.push(showBindingHandlerBtn);
        sidebarElements.push(actionsBtn);
        sidebarElements.push(showWindowBtn);
        sidebarElements.push(showWindowSampleBtn);
        sidebarElements.push(showWindowManagerSampleBtn);

        this.addSidebarElements(sidebarElements);
    }

    /**
     * @param {SidebarElement[]} sidebarElements
     */
    addSidebarElements(sidebarElements) {
        //init SidebarManager when first element is adding
        if (!this.sidebarManager) {
            this.sidebarManager = new SidebarManager(this);
        }
        this.sidebarManager.addSidebarElements(sidebarElements);
    }

    /**
     * @param {SidebarElement} sidebarElement
     */
    addSidebarElement(sidebarElement) {
        //init SidebarManager when first element is adding
        if (!this.sidebarManager) {
            this.sidebarManager = new SidebarManager(this);
        }
        this.sidebarManager.addSidebarElement(sidebarElement);
    }

    animateLoginHtml() {
        var $loginPanel = $('#login-container').find('.panel');
        var $lockEmblem = $('#lock-emblem');
        var $vertoEmblem = $('#verto-emblem');
        var $mainPageContainerWrapper = $('#main-page-container').find('#wrapper');
        var $body = $('body');

        $body.css('overflow', 'hidden');
        $lockEmblem.remove();
        $vertoEmblem.remove();
        $loginPanel.addClass('beforeAnimation');

        setTimeout(() => {
            $mainPageContainerWrapper.removeClass('hidden');
            $loginPanel.remove();

            setTimeout(() => {
                $mainPageContainerWrapper.removeClass('go-away');

                $body.css('overflow', 'auto');
            }, 100);
        }, 500);
    }

    animateWrongCredentials() {
        var $loginPanel = $('#login-container').find('.panel');
    }

    /**
     * Remove the panels from the node and build the page
     *
     * @param page
     */
    removePanelsAndBuildPage(page) {
        //clear the container
        var renderedPanels = page.destinationNode.find('.panel');

        renderedPanels.addClass('beforeAnimation');

        setTimeout(() => {
            page.destinationNode.html('');

            page.render();
        }, 100);
    }

    /**
     * Hide the panels from the node and build the page
     *
     * @param {PageElement} page
     */
    hidePanelsAndBuildPage(page) {
        //clear the container
        var renderedPanels = page.destinationNode.find('.panel');

        renderedPanels.addClass('beforeAnimation');

        setTimeout(() => {
            //clone and hide
            page.destinationNode.parent().append('<div id="callback" style="display:none"></div>');
            page.destinationNode.clone().appendTo("#callback");

            page.destinationNode.html('');

            page.render();
        }, 100);
    }

    /**
     * Handle the common panels behavior
     */
    handleStandardPanelBehavior($panel) {
        var self = this;
        var $showHideBtn = $panel.find('.showhide');
        var $closeBtn = $panel.find('.closebox');

        $showHideBtn.click(e => {
            self.showHidePanel($panel, $showHideBtn);
        });

        $closeBtn.click(() => {
            self.disposePanel($panel);
        });
    }

    /**
     * Handle elements after render
     */
    handleAfterRender() {
        var self = this;
        var $toggleMenuBtn = $('#menu-toggle span');
        var $toggleSearchBtn = $('#toggle-search-btn');
        var $portalSelector = $('#portal-selector');
        var budgetWindow = $('.budget-window');

        setTimeout(() => {
            var smallPlot = $("#sparkline1");

            smallPlot.sparkline([5, 6, 7, 2, 0, 4, 2, 4, 5, 7, 2, 4, 12, 11, 4], {
                type: 'bar',
                barWidth: 7,
                height: '30px',
                barColor: '#62cb31',
                negBarColor: '#53ac2a'
            });

            setTimeout(() => {
                smallPlot.removeClass('beforeAnimation');
            }, 500);

        }, rendering.ANIMATION.ANIMATION_DELAY_SLOW);

        jQueryEventRegistry.addListenerOnce('click', $toggleMenuBtn, e => {
            e.preventDefault();
            let $wrapper = $('#wrapper');

            $wrapper.toggleClass('toggled');
            budgetWindow.toggleClass('beforeAnimation');

            self.toggleArrow($toggleMenuBtn);

            $('body').toggleClass('menu-collapsed');
        });

        jQueryEventRegistry.addListenerOnce('click', $toggleSearchBtn, e => {
            e.preventDefault();

            var $searchBar = $toggleSearchBtn.parents().find('.search-area').find('.search-bar');

            self.toggleSearchBar($searchBar);
        });

        jQueryEventRegistry.addListenerOnce('click', $portalSelector, e => {
            var dropDownMenu = $portalSelector.find('#portal-dropdown-menu');

            if (dropDownMenu.hasClass('hidden')) {
                portalDefinitionRegistry.getPortal('').then(response => {
                    self.showPortalSelector(response, $portalSelector);
                });
            } else {
                self.hidePortalSelector($portalSelector);
            }
        });

        self.userSectionHandlers();
        self.siteMenuHandlers();
    }

    userSectionHandlers() {
        var $userSection = $('.user-section');
        var $dropdown = $('.dropdown-user-section');
        var $logoutButton = $('#btn-logout');

        var $testConnectionErrorBtn = $('#test401');

        jQueryEventRegistry.addListenerOnce('click', $testConnectionErrorBtn, () => {
            var testRegistry = new TestRegistry();

            testRegistry.getNotLogged();
        });

        $userSection.mouseover(() => {
            $dropdown.removeClass('beforeAnimation');
        });

        $userSection.mouseout(() => {
            $dropdown.addClass('beforeAnimation');
        });

        jQueryEventRegistry.addListenerOnce('click', $logoutButton, () => {
            eventBus.send(events.GLOBAL_EVENT.LOGOUT);
        });
    }

    redirectToLoginPage() {
        var $body = $('body');
        var contentManager = new ContentManager();
        var $mainPageContainerWrapper = $('#main-page-container').find('#wrapper');

        $body.css('overflow', 'hidden');
        $mainPageContainerWrapper.addClass('go-away');

        setTimeout(() => {
            $mainPageContainerWrapper.addClass('hidden');
            $('#page-content-wrapper').find('.container-fluid').html('');

            setTimeout(() => {
                $('#login-page-wrapper').removeClass('hidden');

                $body.css('overflow', 'auto');
            }, 100);
        }, 500);

        //build the login page
        var loginPage = new PageElement({
            template: require('./templates/login_page.hbs'),
            id: 'login-page',
            container: '#login-page-wrapper',
            panels: contentManager.loginPageElements()
        });

        loginPage.buildSubPage();
    }

    /**
     * Handle site menu navigation
     */
    siteMenuHandlers() {
        var siteView = new SiteView();
        var contentManager = new ContentManager();
        var portalsContentManager = new PortalsContentManager();

        var $tablePageSelector = $('#site-menu-table');
        var $formPageSelector = $('#site-menu-form');
        var $logoContainerSelector = $('.logo-container');
        var $dashboard = $('#site-menu-dashboard');
        var $sandBox = $('#site-menu-sandbox');
        var $designerBtn = $('#site-menu-designer');

        jQueryEventRegistry.addListenerOnce('click', $tablePageSelector, () => {
            var tablePage = new PageElement({
                id: 'table-page',
                template: require('./templates/table_page.hbs'),
                panels: contentManager.addTablePageElements()
            });

            tablePage.buildSubPage();
            siteView.changePortalName();
        });

        jQueryEventRegistry.addListenerOnce('click', $formPageSelector, () => {
            var formPage = new PageElement({
                id: 'form-page',
                template: require('./templates/form_page.hbs'),
                panels: contentManager.addFormPageElements()
            });

            siteView.changePortalName();
            formPage.buildSubPage();
        });

        jQueryEventRegistry.addListenerOnce('click', $logoContainerSelector, () => {
            var dashboardPage = new PageElement({
                id: 'dashboard-page',
                template: require('./templates/dashboard.hbs'),
                panels: contentManager.addDashboardPageElements()
            });

            siteView.changePortalName('Wybierz portal ');
            siteView.setPortalDefaultSideBar();
            dashboardPage.buildSubPage();
        });

        jQueryEventRegistry.addListenerOnce('click', $dashboard, () => {
            var dashboardPage = new PageElement({
                id: 'dashboard-page',
                template: require('./templates/dashboard.hbs'),
                panels: contentManager.addDashboardPageElements()
            });

            siteView.changePortalName();
            dashboardPage.buildSubPage();
        });

        jQueryEventRegistry.addListenerOnce('click', $sandBox, () => {
            var sandboxPage = new PageElement({
                id: 'dashboard-page',
                template: require('./templates/sandbox.hbs'),
                panels: contentManager.addDashboardPageElements()
            });

            siteView.changePortalName();
            siteView.setSandboxSideBar();
            sandboxPage.buildSubPage();
        });

        jQueryEventRegistry.addListenerOnce('click', $designerBtn, () => {
            var designerPage = new PageElement({
                id: 'designer-page',
                template: require('./templates/designer_page.hbs'),
                panels: portalsContentManager.addDesignerPageElements()
            });

            siteView.changePortalName();
            designerPage.buildSubPage();
        });
    }

    setOptionActionHandlers(targetContainer, panelModel) {
        $(targetContainer).find('.panel').find('.btn-default').click(e => {
            e.preventDefault();

            var pageContent = $('#page-content-wrapper');

            var callbackHtml = pageContent.find('#callback').find('.container-fluid').clone();
            $('#callback').remove();

            pageContent.find('.container-fluid').html(callbackHtml).promise().done(() => {
                panelModel.callbackCancel.find('a').click();
            });
        });
    }

    /**
     * Handle after the designer operator panel has been rendered
     *
     * @param $panelContainer
     */
    setDesignerPortalPanelsHandlers($panelContainer) {
        var view = new SiteView();
        var controller = new Controller();
        var deleteBtn = $panelContainer.find('.deleteButton');
        var editBtn = $panelContainer.find('.editButton');
        var ExportBtn = $panelContainer.find('.exportButton');

        deleteBtn.click(() => {
            var questionModel = {
                question: 'Czy na pewno chcesz usunąć ten portal ?',
                positiveButton: 'Tak',
                negativeButton: 'Nie'
            };

            controller.showQuestion($panelContainer, questionModel, 'portal');
        });

        editBtn.click(e => {
            view.handleEditPortal($panelContainer);
        })
    }

    handleEditPortal($panelContainer) {
        var portalDesignerView = new PortalsDesignerView();
        var $panel = $panelContainer.find('.panel-default');
        var id = $panel.find('#panel-title').attr('portalId').trim();
        var title = $panel.find('#panel-title').find('h4').text().trim();

        portalDesignerView.handleEditPanel({panel: $panel, id: id, title: title});
    }

    /**
     * Toggle the hide/show menu arrow
     *
     * @private
     */
    toggleArrow($toggleMenuBtn) {
        if ($toggleMenuBtn.hasClass('glyphicon-arrow-left')) {
            $toggleMenuBtn.removeClass('glyphicon-arrow-left');
            $toggleMenuBtn.addClass('glyphicon-arrow-right')
        } else {
            $toggleMenuBtn.removeClass('glyphicon-arrow-right');
            $toggleMenuBtn.addClass('glyphicon-arrow-left');
        }
    }

    /**
     * Toggle the search bar
     *
     * @private
     *
     * @param $searchBar
     */
    toggleSearchBar($searchBar) {
        if ($searchBar.hasClass('expand-bar')) {
            $searchBar.removeClass('expand-bar');
        } else {
            $searchBar.addClass('expand-bar');
        }
    }

    /**
     * Handle after the activity panel has been rendered
     */
    setActivityPanelHandlers() {
        var $panelBodyContainer = $('#activity-container').find('.panel-body');
        $panelBodyContainer.addClass('list');
    }

    /**
     * Handle after the user activity panel has been rendered
     */
    setUserActivityPanelHandlers() {
        var $panelBodyContainer = $('#activity-container').find('.panel-body');
        $panelBodyContainer.addClass('list');
    }

    /**
     * Handle after the example table panel has been rendered
     */
    setExampleTablePanelHandlers() {
    }

    /**
     * Handle after the example table panel has been rendered
     */
    setWizardPanelHandlers() {
        var self = this;

        //Initialize tooltips
        $('.nav-tabs > li a[title]').tooltip();

        $('a[data-toggle="tab"]').on('show.bs.tab', function (e) {

            var $target = $(e.target);

            if ($target.parent().hasClass('disabled')) {
                return false;
            }
        });

        $('.next-step').click(function (e) {
            var $active = $('.wizard .nav-tabs li.active');
            $active.next().removeClass('disabled');
            $($active).next().find('a[data-toggle="tab"]').click();

        });
        $('.prev-step').click(function (e) {
            var $active = $('.wizard .nav-tabs li.active');
            $($active).prev().find('a[data-toggle="tab"]').click();

        });
    }

    /**
     * Handle after the form panel has been rendered
     */
    setFormPanelHandlers() {
        var datePicker = $('.date-picker').datepicker();
    }

    /**
     * Handle after the checkboxes form panel has been rendered
     */
    setCheckboxesPanelHandlers() {
    }

    /**
     * Handle after the data table panel has been rendered
     */
    setDataTablePanelHandlers(targetContainer, panelModel) {
        var id = panelModel.panelBodyModel.id;

        $(`[id="${id}_table"]`).DataTable({"dom": 'tp', select: 'single'});
    }

    addEmptyOption($panelContainer) {
    }

    getPortalId($panel) {
        return $panel.find('#panel-title').attr('portalId').trim();
    }

}

export default SiteView;
