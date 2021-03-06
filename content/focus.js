
window.addEventListener('load', focusInit, false);

var _org_removeTab;

function focusInit() {
   gBrowser.mTabContainer.addEventListener('mousedown', oreFocus.mousedownTab,true);
   gBrowser.mTabContainer.addEventListener('click',  oreFocus.clickTab,true);
   gBrowser.mTabContainer.addEventListener('select', oreFocus.selectTab, true);

   eval("gBrowser._blurTab ="+gBrowser._blurTab.toString().replace(
            'this.selectedTab = tab',
            'this.selectedTab = this.mCurrentTab._ore || tab'
            ));

   _org_removeTab = gBrowser._blurTab;

   gBrowser._blurTab = function(aTab) {
      oreFocus.remove(aTab.linkedPanel);

      if(gBrowser.mCurrentTab == aTab) {
         aTab._ore  = id2tab(oreFocus.history.pop());
         aTab.owner = null;
      }

      _org_removeTab.apply(gBrowser, arguments);
   }
}

// 例外を考えないといけない
function id2tab(id) {
   var containerChilds = gBrowser.mTabContainer.childNodes;

   for(var i = 0; i < containerChilds.length; ++i) {
      if(containerChilds[i].linkedPanel == id) {
         return containerChilds[i];
      }
   }

   return undefined;
}

var oreFocus = {
   history: new Array(),
   lastTab: null,

   remove: function(del) {
      for(var i = 0; i < oreFocus.history.length; i++)
         if(oreFocus.history[i] == del) { oreFocus.history.splice(i, 1); i--; }
   },

   selectTab: function(event) {
      // debug('select');
      if(gBrowser.mCurrentTab) {
         var newLink = gBrowser.mCurrentTab.linkedPanel;
         oreFocus.remove(newLink);
         oreFocus.history.push(newLink);
      }
   },

   clickTab: function(event) {
      if(event.target.mOverCloseButton) return;
      if((event.button == 0) && (event.target.localName == "tab")) {
         if(event.ctrlKey || event.shiftKey) return;
         if(oreFocus.lastTab == event.target) {
            // debug('focus');
            var nTab = id2tab(oreFocus.history[oreFocus.history.length-2]);
            if(nTab) gBrowser.selectedTab = nTab;
         }
      }
   },

   mousedownTab: function(event) {
      if(event.target.localName == "tab")
         oreFocus.lastTab = gBrowser.selectedTab;
   }
}

// function debug(str) { dump('> ' + str + "\n"); }

