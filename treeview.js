

class TreeView extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadow = this.shadowRoot;
        this.data = []; 
        this.urljson = this.getAttribute('data-url');
    }

    static get observedAttributes() {
        return ['data-url'];
    }

    attributeChangedCallback(name, oldValue, newValue) {

        if (name === 'data-url' && oldValue !== newValue && oldValue !== null) {
            console.log('Attribute changed:', name, oldValue, newValue);
            this.urljson = newValue;
            if (this.urljson)  {
            let x = this.shadowRoot.getElementById('root');
            x.remove();
            this.setDataUrl(this.urljson);
            }
        }
    }
    
    connectedCallback() {
        if (this.urljson)  {this.setDataUrl(this.urljson);}
        this.shadow.addEventListener("click", this.handleClick.bind(this));
        this.shadow.addEventListener("change", this.handleChange.bind(this));
    }

    setDataUrl(urljson) {
        return new Promise((resolve, reject) => {

            fetch(urljson)
            .then(response => {
                
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                this.data = data;
                this.render();
                
                resolve();
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                reject();
                // Aquí puedes manejar el error de manera adecuada, por ejemplo, mostrando un mensaje al usuario
            });
            
        })
    }


    setData(data) {
        try {
                    // Verifica si el árbol ya está creado
            if (this.shadowRoot.querySelector('ul') !== null) {
                throw new Error('El árbol ya está creado.');
            }
            if (data === null) {
                throw new Error('No se proporcionó ningún dato.');
            }
            if ( typeof data !== 'object') {
                throw new Error('Los datos proporcionados no son válidos.');
            }


    
            this.data = data;
            this.render();

        }
        catch (error) {
            console.error('Error setting data:', error);
            // Aquí puedes manejar el error de manera adecuada, por ejemplo, mostrando un mensaje al usuario
        }
    }


    render() {

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
            .toggle {
                cursor: default;
            }
            
          </style>
        `;
        var ul = document.createElement("ul");
        ul.id = "root";
        
        this.data.forEach((nodeData) =>{
            var node = this.createTreeNode(nodeData,ul);
            ul.appendChild(node);
        });
        this.shadow.appendChild(ul);
    }
    
    createTreeNode(nodeData,parentUl = null) {
        var li = document.createElement("li");
        var nodeId;


        //da valor a nodeId
        let setId=(i=1)=>{
            if (parentUl.id === "root"  ) { //nodo raiz nuevo id
                nodeId = `${parentUl.children.length+i}`;
            }else{ // si es un nodo hijo idpadre. nuevo id
                var idLiParent =parentUl.parentElement.id
                nodeId = `${idLiParent}.${parentUl.children.length+i}`;
            }
            idtaken(i++);
            
        }
        
        // Verifica si el id ya existe? si es así, crea un nuevo id, si no, lo asigna
        let idtaken = (i) => {
            if (this.shadowRoot.getElementById(nodeId)) {
                setId(i+1);
            } else {
                li.id = `${nodeId}`;
            }
        }
        setId();
        idtaken();


        // ►
        if (nodeData.children && nodeData.children.length > 0) {
            var span = document.createElement("span");
            span.textContent = "►";
            span.classList.add("toggle");
            li.appendChild(span);
        }else{
            var span = document.createElement("span");
            span.textContent = "ㅤ";
            span.classList.add("NoToggle");
            li.appendChild(span);
        }
        
        // checkbox 
        var checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.classList.add("node-checkbox");
        li.appendChild(checkbox);
        
        // label
     
        var spanLabel = document.createElement("span");
        spanLabel.textContent =" "+  nodeData.label;
        spanLabel.classList.add("label-node");
        li.appendChild(spanLabel);



        if (nodeData.children && nodeData.children.length > 0) {
            var ul = document.createElement("ul");
            ul.classList.add("closed");
            li.appendChild(ul);
            nodeData.children.forEach((child) => {
                var childNode = this.createTreeNode(child, ul);
                ul.appendChild(childNode);
            });

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
            this.recursiveCheks(checkbox);
        }
    }

    recursiveCheks(checkbox) {
        this.cheksToChildren(checkbox);
        this.cheksToFather(checkbox);
    }

    cheksToFather(checkbox){
        
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
            this.cheksToFather(grandCheckbox);
        }

    }

    cheksToChildren(checkbox){
        var Li = checkbox.parentElement;
        if (Li) {
            var childUl = Li.querySelector("ul");
            if (childUl) {
                var checkboxes = childUl.querySelectorAll(".node-checkbox");
                checkboxes.forEach((childCheckbox) =>{childCheckbox.checked = checkbox.checked;
                });
            }
        }
    }

    checkById(id) {
        try {
            // Busca el elemento li con el id proporcionado
            var li = this.shadow.getElementById(`${id}`);
            if (li.tagName !== "LI" ) {
                throw new Error('Id incorrecto.');
            }

            // Busca la casilla de verificación dentro del elemento li
            var checkbox = li.querySelector(".node-checkbox");

            if (checkbox) {
                // Marca la casilla de verificación
                checkbox.checked = true;
            }
            
            this.recursiveCheks(checkbox);
        }catch (error) {
            console.error('id no corresponde a un li:', error);
        }
    }

    discheckById(id) {
    try {
        // Busca el elemento li con el id proporcionado
        var li = this.shadowRoot.getElementById(`${id}`);

        if (li.tagName !== "LI" ) {
            throw new Error('Id incorrecto.');
        }
    
        // Busca la casilla de verificación dentro del elemento li
        var checkbox = li.querySelector(".node-checkbox");
        if (checkbox) {
            // Marca la casilla de verificación
            checkbox.checked = false;
        }
        
        this.recursiveCheks(checkbox);
    } catch (error) {
        console.error('id no corresponde a un li:', error);
    }
    }

    deleteById(id) {
        try {
            //desmarca casilla
            this.discheckById(id);
            // Busca el elemento li con el id proporcionado
            var li = this.shadowRoot.getElementById(`${id}`);

            if (li.tagName !== "LI" ) {
                throw new Error('Id incorrecto.');
            }

            // Elimina el elemento li
            li.parentNode.removeChild(li);
            
        } catch (error) {
            console.error('id no corresponde a un li:', error);
        }
    }

    deleteChecked(){
        var rootUl =this.shadow.getElementById("root")
        var checkboxes = rootUl.querySelectorAll(".node-checkbox");
            checkboxes.forEach((childCheckbox) =>{
                if (childCheckbox.checked=== true){ 
                    var liCheck =childCheckbox.parentElement;
                    this.deleteById(liCheck.id)
                }
            });
        }
/*      var Li = checkbox.parentElement
        if (Li) {
            var childUl = Li.querySelector("ul");
            if (childUl) {
                var checkboxes = childUl.querySelectorAll(".node-checkbox");
                checkboxes.forEach((childCheckbox) =>{childCheckbox.checked = checkbox.checked;
                });
            }
        }
 */
    

    createChildren(childData, id = null) {
    try {        
        if (childData == null) {
            throw new Error('No se proporcionó ningún dato.');
        }
        var node={label:childData}
        if (id ) {
            // Busca el elemento li con el id proporcionado
            let li = this.shadowRoot.getElementById(`${id}`);


            if (!li) { //! id no existe
                throw new Error('Id incorrecto.');
            }

            // Busca el elemento ul dentro del elemento li
            let ul = li.querySelector("ul");
            if (!ul) {
                // Si no existe un elemento ul, lo crea y lo añade al elemento li
                ul = document.createElement("ul");
                ul.classList.add("closed");
                li.appendChild(ul);

                // Convierte un nodo sin hijos, en un nodo con hijos
                let span = li.querySelector(".toggle");
                if (!span) {
                    span = li.querySelector(".NoToggle")
                    span.textContent = "►";
                    span.classList.remove("NoToggle");
                    span.classList.add("toggle");
                }
            }
  
            //crea un nuevo nodo hijo
            var childNode = this.createTreeNode(node, ul);
            // Añade el nuevo nodo al elemento ul
            ul.appendChild(childNode);

        } else {
            // Crea un nuevo nodo principal
            let ul = this.shadowRoot.getElementById("root");
            var childNode = this.createTreeNode(node, ul);
            // Añade el nuevo nodo al shadow root
            ul.appendChild(childNode);
        }
    }catch (error) {
        console.error('Error creating children:', error);
    }}

    getTreeData() {
        // Inicia con el nodo raíz
        var rootNodes = this.shadowRoot.querySelectorAll('#root > li');
        return Array.from(rootNodes).map((node)=>this.getNodeData(node));
    }

    getNodeData(node) {
        var checkbox = node.querySelector('.node-checkbox');
        var label = node.querySelector(".label-node").textContent;
   
        var estate = checkbox.checked ;
        var children = node.querySelectorAll(':scope > ul > li');
        if (children.length > 0) {
            return {
                label: label,
                estate: estate,
                children: Array.from(children).map((node)=>this.getNodeData(node)),


            };
        } else {
            return {
                label: label,
                estate: estate,
                children: children,

            };
        }
    }

    setStyles(element, styles) {
        // Crea un nuevo elemento 'style'
        const style = document.createElement('style');

        // Convierte el objeto de estilos en una cadena de texto CSS
        let stylesText = '';
        for (let property in styles) {
            stylesText += `${property}: ${styles[property]}; `;
        }

        // Usa los estilos CSS proporcionados
        style.textContent = `${element} { ${stylesText} }`;

        // Agrega el elemento 'style' al shadow root
        this.shadowRoot.appendChild(style);
    }

}
customElements.define('tree-view', TreeView);