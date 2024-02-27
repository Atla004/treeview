export class TreeView {
    constructor(containerId, data) {
        this.container = document.getElementById(containerId);
        this.data = data;



        
        this.container.addEventListener("click", this.handleClick.bind(this));
        this.container.addEventListener("change", this.handleChange.bind(this));
        this.init();
    }

    init() {
        this.container.innerHTML = "";
        var ul = document.createElement("ul");
        this.data.forEach(function(nodeData) {
            var node = this.createTreeNode(nodeData);
            ul.appendChild(node);
        }, this);
        this.container.appendChild(ul);
    }

    createTreeNode(nodeData) {
        var li = document.createElement("li");

        if (nodeData.children && nodeData.children.length > 0) {
            var span = document.createElement("span");
            span.textContent = "+";
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
            nodeData.children.forEach(function(child) {
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
                    event.target.textContent = "+";
                } else {
                    event.target.textContent = "-";
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
        var grandUl = grandLi.querySelector("ul");
        var grandCheckbox= grandLi.querySelector("input");

        if (grandLi.tagName !== 'DIV') {
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

// Datos del árbol


// Crear instancia del componente TreeView
