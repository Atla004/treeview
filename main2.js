const treeView = document.createElement('tree-view');
treeView.id = 'tree';
document.body.appendChild(treeView);

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

