"use strict";

console.clear();
window.onload = function () {

  var Model = {
    expressionToEval: "",
    historyArray: [],
    mmry: "",
    result: 0,
    clipboard: "",
    currentIndex: 0,
    outputExp: "",
    outputDisplay: "",
    evaluateFunction: function evaluateFunction(opt) {
      if (!this.outputDisplay) {
        this.outputExp = "Enter a valid expression";
        this.outputDisplay = "";
      } else {
        var expToEval = this.outputDisplay;
        try {
          if (opt === 'Integral') {
            this.result = Algebrite.run('integral(' + expToEval + ')');
          } else if (opt === 'Derivative') {
            this.result = Algebrite.run('d(' + expToEval + ')');
          } else {
            if (/x|y/g.test(expToEval)) {
              this.result = Algebrite.run(expToEval);
            } else {
              // number, BigNumber, Fraction
              var mathAPI = math.create({ number: 'number' });
              this.result = mathAPI.eval(expToEval).toString();
            }
          }
          var resultObject = {};
          resultObject.expression = expToEval;
          resultObject.result = this.result;
          this.historyArray.push(resultObject);
          this.currentIndex = this.historyArray.length - 1;

          this.outputExp = this.historyArray[this.currentIndex].expression;
          this.outputDisplay = this.historyArray[this.currentIndex].result;
        } catch (e) {
          var resultObject = {};
          resultObject.expression = this.expressionToEval;
          resultObject.result = e;
          this.historyArray.push(resultObject);

          this.outputExp = this.historyArray[this.currentIndex].expToEval;
          this.outputDisplay = this.historyArray[this.currentIndex].e;
        }
      }
    },
    updateClipboard: function updateClipboard(value) {

      this.clipboard = value;
    },
    pasteHandler: function pasteHandler() {

      this.outputDisplay += this.clipboard;
    },
    historyHandle: function historyHandle(direction) {
      switch (direction) {
        case "Prev":
          if (!this.historyArray.length || this.historyArray.length == 0) {
            return;
          }
          this.currentIndex = this.currentIndex > 0 ? this.currentIndex -= 1 : 0;
          this.outputExp = this.historyArray[this.currentIndex].expression;
          this.outputDisplay = this.historyArray[this.currentIndex].result;
          break;
        case "Next":
          if (!this.historyArray.length || this.historyArray.length == 0) {
            return;
          }
          this.currentIndex = this.currentIndex < this.historyArray.length - 1 ? this.currentIndex += 1 : this.historyArray.length - 1;
          this.outputExp = this.historyArray[this.currentIndex].expression;
          this.outputDisplay = this.historyArray[this.currentIndex].result;
          break;
          break;
        default:
          alert('error');
      }
    },
    deleteHandle: function deleteHandle() {

      this.outputDisplay = this.outputDisplay.length > 0 ? this.outputDisplay.substring(0, this.outputDisplay.length - 1) : "";
    },
    clearHandle: function clearHandle() {
      this.outputExp = "";
      this.outputDisplay = "";
    },
    inputHandle: function inputHandle(key) {

      this.outputDisplay += key;
    },
    memoryHandle: function memoryHandle(arg) {
      switch (arg) {
        //case "m+":
        case "mc":
          this.mmry = "";
          break;
        case "m+":
          this.mmry = this.mmry.length > 0 ? (this.mmry + '+' + this.outputDisplay) : (this.outputDisplay.length > 0 ? this.outputDisplay : "");
          break;
        case "m-":
          this.mmry = this.mmry.length > 0 ? (this.mmry + '-' + this.outputDisplay) : (this.outputDisplay.length > 0 ? this.outputDisplay : "");
          break;
        case "mr":
          this.mmry = this.mmry.length > 0 ? Algebrite.run(this.mmry) : "";
          this.outputDisplay += this.mmry;
          break;
        default:
          alert('error');
      }
    },
    userPasteHandle: function userPasteHandle(data) {
      this.clipboard = data;
      this.outputDisplay += data;
    }
  };

  var View = {
    btnEval: document.getElementById('Eval'),
    btnDerivative: document.getElementById('Derivative'),
    btnIntegral: document.getElementById('Integral'),
    userInput: document.getElementById('UserInput'),
    evalResult: document.getElementById('EvalResult'),
    copyOp: document.getElementById('CopyOp'),
    copyResult: document.getElementById('CopyResult'),
    pasteResult: document.getElementById('PasteResult'),
    prevButton: document.getElementById('PrevButton'),
    nextButton: document.getElementById('NextButton'),
    deleteButton: document.getElementById('Delete'),
    clearButton: document.getElementById('Clear'),
    render: function render(M) {
      //console.log(M);
      document.getElementById('EvalResult').value = M.outputExp;
      document.getElementById('UserInput').value = M.outputDisplay;
    },
    init: function init(C) {

      // Evaluation buttons'
      this.btnEval.onclick = function(){
        C.evalHandler('Eval');
      }
      this.btnDerivative.onclick = function(){
        C.evalHandler('Derivative');
      }
      this.btnIntegral.onclick = function(){
        C.evalHandler('Integral');
      }
      
      // Input expression text area
      this.userInput.onclick = function(){
        C.handleCopy(this.userInput);
      }

      // Output expression text area
      this.evalResult.onclick = function(){
        C.handleCopy(this.evalResult);
      }

      // Copy output button
      this.copyOp.onclick = function(){
        document.location.href = "/html/html.html";
        //C.handleCopy(this.evalResult);
      }

      // Copy result button
      this.copyResult.onclick = function(){
        C.handleCopy(this.userInput);
      }

      // Paste result button
      this.pasteResult.onclick = function(){
        C.handlePaste();
      }

      // Navigation Prev button
      this.prevButton.onclick = function () {
        C.handleHistory('Prev');
      };
      // Navigation Next button
      this.nextButton.onclick = function () {
        C.handleHistory('Next');
      };
      // Delete button
      this.deleteButton.onclick = function () {
        C.handleDelete();
      };
      // Clear button
      this.clearButton.onclick = function () {
        C.handleClear();
      };
      
      // Digits buttons
      var digits = document.getElementsByClassName('digit');
      for (var i = 0; i < digits.length; ++i) {
        var item = digits[i].onclick = function () {
          var selectedDigit = this.getAttribute('data-val');
          C.handleInput(selectedDigit);
        };
      }

      // Non Digits buttons
      var cores = document.getElementsByClassName('core');
      for (var i = 0; i < cores.length; ++i) {
        var item = cores[i].onclick = function () {
          var selectedCore = this.getAttribute('data-val');
          C.handleInput(selectedCore);
        };
      }

      //Memory buttons
      var memory = document.getElementsByClassName('memory');
      for (var i = 0; i < memory.length; ++i) {
        var item = memory[i].onclick = function () {
          var selectedMemory = this.getAttribute('data-val');
          C.handleMemory(selectedMemory);
        };
      }

      //Window events
      //window.addEventListener('paste', C.handleUserPaste);
      window.addEventListener("paste", function (e) {
        var clipboardData, pastedData;

        // Stop data actually being pasted into div
        e.stopPropagation();
        e.preventDefault();

        // Get pasted data via clipboard API
        clipboardData = e.clipboardData || window.clipboardData;
        pastedData = clipboardData.getData('Text');
        C.handleUserPaste(pastedData);
      });
      // TODO: add pressed keys
      window.addEventListener("keydown", function (event) {
        if (event.keyCode == 13) {
          event.preventDefault();
          event.stopPropagation();
          document.getElementById("Eval").click();
        }
        if (event.keyCode == 8) {
          C.handleDelete();
        }
        if (event.keyCode == 46) {
          C.handleClear();
        }
      });
      window.addEventListener("keypress", function (event) {
        var keyIn = event.keyIdentifier ? parseInt(event.keyIdentifier.substr(2), 16) : event.keyCode;
        var charIn = String.fromCharCode(keyIn);
        //console.log(keyIn);

        if (/[+|-|*|\/|.|^|%|!|(|)|,|<|>|1|2|3|4|5|6|7|8|9|x|y|e|i|\-]/g.test(charIn)) {
          C.handleInput(charIn);
        }
      });
    }
  };

  var Controller = {
    load: function load() {
      // Singleton pattern
      if(Controller.instance){
        return;
      }
      console.log(Controller.instance)
      Controller.instance = this;
      View.init(this);
      View.render(Model);
    },
    evalHandler: function evalHandler(opts) {
      Model.evaluateFunction(opts);
      this.update();
    },
    update: function update() {

      View.render(Model);
    },
    handleCopy: function handleCopy(elem) {
      // create hidden text element, if it doesn't already exist
      var targetId = "_hiddenCopyText_";
      var isInput = elem.tagName === "INPUT" || elem.tagName === "TEXTAREA";
      var origSelectionStart, origSelectionEnd;
      if (isInput) {
        // can just use the original source element for the selection and copy
        target = elem;
        origSelectionStart = elem.selectionStart;
        origSelectionEnd = elem.selectionEnd;
      } else {
        // must use a temporary form element for the selection and copy
        target = document.getElementById(targetId);
        if (!target) {
          var target = document.createElement("textarea");
          target.style.position = "absolute";
          target.style.left = "-9999px";
          target.style.top = "0";
          target.id = targetId;
          document.body.appendChild(target);
        }
        target.textContent = elem.textContent;
      }
      // select the content
      var currentFocus = document.activeElement;
      target.focus();
      target.setSelectionRange(0, target.value.length);

      // copy the selection
      var succeed;
      try {
        succeed = document.execCommand("copy");
      } catch (e) {
        succeed = false;
      }
      // restore original focus
      if (currentFocus && typeof currentFocus.focus === "function") {
        currentFocus.focus();
      }

      if (isInput) {
        // restore prior selection
        elem.setSelectionRange(origSelectionStart, origSelectionEnd);
      } else {
        // clear temporary content
        target.textContent = "";
      }
      Model.updateClipboard(elem.value);
      return succeed;
    },
    handlePaste: function handlePaste() {
      Model.pasteHandler();
      View.render(Model);
    },
    handleHistory: function handleHistory(dir) {
      Model.historyHandle(dir);
      View.render(Model);
    },
    handleDelete: function handleDelete() {
      Model.deleteHandle();
      View.render(Model);
    },
    handleClear: function handleClear() {
      Model.clearHandle();
      View.render(Model);
    },
    handleInput: function handleInput(key) {
      Model.inputHandle(key);
      View.render(Model);
    },
    handleMemory: function handleMemory(arg) {
      Model.memoryHandle(arg);
      View.render(Model);
    },
    handleUserPaste: function handleUserPaste(data) {
      Model.userPasteHandle(data);
      View.render(Model);
    }
  };

  Controller.load();
};

var myElement = document.getElementById('CalcNumpad');

// create a simple instance
// by default, it only adds horizontal recognizers
var mc = new Hammer(myElement);

// listen to events...
mc.on("swipeleft swiperight", function(ev) {
  if(ev.type === 'swiperight'){
    document.getElementById('ShowAdvanced').checked = true;
  } else if(ev.type === 'swipeleft'){
    document.getElementById('ShowAdvanced').checked = false;
  }
  console.log(ev.type +" gesture detected.");
});