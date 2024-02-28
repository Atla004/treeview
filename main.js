class TreeView extends HTMLElement {
  constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      this.shadow = this.shadowRoot;
    }
    
    connectedCallback() {
    this.data = JSON.parse(this.getAttribute('data'));
    this.shadow.addEventListener("click", this.handleClick.bind(this));
    this.shadow.addEventListener("change", this.handleChange.bind(this));
    this.init();
  }

/*   static get observedAttributes() {
    return ['data'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'data') {
        this.data = JSON.parse(newValue);
        this.init();
    }
  } */


  stilo(){
    this.shadow.innerHTML = `
    <style>
    ul {
        list-style-type: none;
        padding-left: 20px;
    }
    ul ul {
        margin-left: 20px;
    }
    .closed {
        display: none;
    }

  </style>
  `
  }

  init() {

    this.shadow.innerHTML = "";
    this.stilo();
    var ul = document.createElement("ul");
    this.data.forEach((nodeData) =>{
        var node = this.createTreeNode(nodeData);
        ul.appendChild(node);
    }, this);
    this.shadow.appendChild(ul);
  }

  createTreeNode(nodeData) {
    var li = document.createElement("li");

    if (nodeData.children && nodeData.children.length > 0) {
        var span = document.createElement("span");
        span.textContent = "►";
        span.classList.add("toggle");
        li.appendChild(span);
    }
    
    var text = document.createTextNode(" " + nodeData.label);
    li.appendChild(text);

    var checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.classList.add("node-checkbox");
    li.appendChild(checkbox);
    
    if (nodeData.children && nodeData.children.length > 0) {
        var ul = document.createElement("ul");
        ul.classList.add("closed");
        nodeData.children.forEach((child) => {
            var childNode = this.createTreeNode(child);
            ul.appendChild(childNode);
        }, this);
        li.appendChild(ul);
    }

    return li;
  }

  handleClick(event) {
    if (event.target && event.target.classList.contains("toggle")) {
        var parent = event.target.parentElement;
        var ul = parent.querySelector("ul");
        if (ul) {
            ul.classList.toggle("closed");
            if (ul.classList.contains("closed")) {
                event.target.textContent = "►";
            } else {
                event.target.textContent = "▼";
            }
        }
    }
  }

  handleChange(event) {
      if (event.target && event.target.classList.contains("node-checkbox")) {
          var checkbox = event.target;
          this.checks(checkbox);
      }
  }

  checks(checkbox) {
      this.checksToChildren(checkbox);
      this.checksToFather(checkbox);
  }

  checksToFather(checkbox){
    var Li = checkbox.parentElement;   
    var grandLi = Li.parentElement.parentElement;


    if (grandLi) {
        var grandUl = grandLi.querySelector("ul");
        var grandCheckbox= grandLi.querySelector("input");
        var grandUlCheckboxes = grandUl.querySelectorAll(".node-checkbox");
        if (Array.from(grandUlCheckboxes).some(checkbox => checkbox.checked)){
            if (Array.from(grandUlCheckboxes).every(checkbox => checkbox.checked)) {
                grandCheckbox.indeterminate = false;
                grandCheckbox.checked = true;

            }else{
                grandCheckbox.indeterminate = true;
                grandCheckbox.checked = false;
            }
        }else{
            grandCheckbox.indeterminate = false;
            grandCheckbox.checked = false;
        }
        this.checksToFather(grandCheckbox);
    }
  }

  checksToChildren(checkbox){
    var Li = checkbox.parentElement;
    if (Li) {
        var childUl = Li.querySelector("ul");
        if (childUl) {
            var checkboxes = childUl.querySelectorAll(".node-checkbox");
            checkboxes.forEach((childCheckbox) =>{
                childCheckbox.checked = checkbox.checked;
            });
        }
    }
  }
}
customElements.define('tree-view', TreeView);

