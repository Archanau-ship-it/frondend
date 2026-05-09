let students = [];

function addstu() {
    let marks = Number(document.getElementById("mar").value);

    if (marks < 0 || marks > 100) {
        alert("Marks must be between 0 and 100!");
        return;
    }

    let student = {
        name:    document.getElementById("name").value,
        dept:    document.getElementById("dept").value,
        sem:     document.getElementById("sem").value,
        loc:     document.getElementById("loc").value,
        marks:   marks,
        attend:  Number(document.getElementById("attendance").value),
        perform: document.getElementById("per").value
    };

    students.push(student);
    displaystudents(students);
}

function displaystudents(list) {
    let tbody = document.getElementById("tablebody");
    tbody.innerHTML = "";

    list.forEach(function(s) {
        let row = "<tr>" +
            "<td>" + s.name    + "</td>" +
            "<td>" + s.dept    + "</td>" +
            "<td>" + s.sem     + "</td>" +
            "<td>" + s.loc     + "</td>" +
            "<td>" + s.marks   + "/100</td>" +
            "<td>" + s.attend  + "%</td>" +
            "<td>" + s.perform + "</td>" +
        "</tr>";
        tbody.innerHTML += row;
    });
}

function sortbymarks() {
    let sort = [...students].sort(function(a, b) {
        return b.marks - a.marks;
    });
    displaystudents(sort);
}

function sortbydept() {
    let sort = [...students].sort(function(a, b) {
        return a.dept.localeCompare(b.dept);
    });
    displaystudents(sort);
}

function sortbyperform() {
    let rank = { "High": 1, "Medium": 2, "Low": 3 };
    let sort = [...students].sort(function(a, b) {
        return rank[a.perform] - rank[b.perform];
    });
    displaystudents(sort);
}