
    /*
    const treeView = document.createElement('tree-view');
    treeView.id = 'nosee';
    document.body.appendChild(treeView);

    const treeView2 = document.createElement('tree-view');
    treeView2.id = 'nose';
    document.body.appendChild(treeView2);


    let dataObjeto = () =>{
        let data = [{
            label: "root",
            children: [
                {label: "child1",
                    children: [
                        {label: "child1.1"},
                        {label: "child1.2"}
                    ]
                },
                {label: "child2"}
            ]
        }]

        treeView.setData(data);
    
    }


    let dataJson = () =>{
        let data = [
            {"label": "Root",
            "children": [
                {"label": "Child 3"},
                {"label": "Child 5"}
            ]},
            {"label": "Root",
            "children": [
            {"label": "Child 3"},
            {"label": "Child 4",
            "children": [
                {"label": "Child 3"},
                {"label": "Child 4"}
            ]}
            ]}
        ]
        treeView.setData(data);
    }
    
    
    dataJson();
    treeView.createChildren("dar");
    treeView.createChildren("mo", "3");
    treeView.createChildren("mu", "3.1");
    treeView.createChildren("ja", "3.1");
    treeView.checkById("3.1.1");
    treeView.discheckById("3.1.1");
    treeView.deleteById("3.1.1");
    treeView.createChildren("jb", "3.1");
    treeView.createChildren("jc", "3.1.3");
    treeView.checkById("3.1.3");
    console.log(treeView.getTreeData())
    treeView.setStyles( "ul",{color: "red", "background-color": "black"});
    

    
    async function trv() {
    await treeView2.setDataUrl('data2.json');
    treeView2.createChildren("dar");
    treeView2.createChildren("mo", "3");
    treeView2.createChildren("mu", "3.1");
    treeView2.createChildren("ja", "3.1");
    treeView2.checkById("3.1.1");
    treeView2.discheckById("3.1.1");
    treeView2.deleteById("3.1.1");
    treeView2.createChildren("jb", "3.1");
    treeView2.createChildren("jc", "3.1.3");
    treeView2.checkById("3.1.3");
    console.log(treeView.getTreeData())
    treeView2.setStyles( "ul",{color: "red", "background-color": "black"});
    document.body.appendChild(treeView2);

    }

    trv();
    

    


*/
   const treeView3 = document.getElementById('treeview3');
