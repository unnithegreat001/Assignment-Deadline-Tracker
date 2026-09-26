// Store all assignments in an array

let assignments = JSON.parse(
    localStorage.getItem("assignments")
) || [];


// Get HTML elements

const assignmentForm =
    document.getElementById("assignmentForm");

const assignmentList =
    document.getElementById("assignmentList");

const filter =
    document.getElementById("filter");
const search =
    document.getElementById("search");

const sort =
    document.getElementById("sort");

// Dashboard elements

const totalAssignments =
    document.getElementById("totalAssignments");

const pendingAssignments =
    document.getElementById("pendingAssignments");

const completedAssignments =
    document.getElementById("completedAssignments");

const overdueAssignments =
    document.getElementById("overdueAssignments");
const todayAssignments =
    document.getElementById("todayAssignments");

const weekAssignments =
    document.getElementById("weekAssignments");

// Add assignment

assignmentForm.addEventListener("submit", function(event) {

    event.preventDefault();


    const title =
        document.getElementById("title").value;

    const subject =
        document.getElementById("subject").value;

    const deadline =
        document.getElementById("deadline").value;

    const priority =
        document.getElementById("priority").value;


    const assignment = {

        id: Date.now(),

        title: title,

        subject: subject,

        deadline: deadline,

        priority: priority,

        completed: false

    };


    assignments.push(assignment);


    saveAssignments();

    assignmentForm.reset();

    displayAssignments();

});


// Save assignments

function saveAssignments() {

    localStorage.setItem(
        "assignments",
        JSON.stringify(assignments)
    );

}
// Search assignments

const searchText =
    search.value.toLowerCase().trim();


if (searchText !== "") {

    filteredAssignments =
        filteredAssignments.filter(
            assignment =>
                assignment.title
                    .toLowerCase()
                    .includes(searchText)

                ||

                assignment.subject
                    .toLowerCase()
                    .includes(searchText)
        );

}


// Sort assignments

if (sort.value === "nearest") {

    filteredAssignments.sort(
        (a, b) =>
            new Date(a.deadline) -
            new Date(b.deadline)
    );

}


if (sort.value === "farthest") {

    filteredAssignments.sort(
        (a, b) =>
            new Date(b.deadline) -
            new Date(a.deadline)
    );

}

// Display assignments

function displayAssignments() {

    assignmentList.innerHTML = "";


   let filteredAssignments = [...assignments];


    // Apply filter

    if (filter.value === "pending") {

        filteredAssignments =
            assignments.filter(
                assignment =>
                    !assignment.completed &&
                    !isOverdue(assignment.deadline)
            );

    }


    if (filter.value === "completed") {

        filteredAssignments =
            assignments.filter(
                assignment =>
                    assignment.completed
            );

    }


    if (filter.value === "overdue") {

        filteredAssignments =
            assignments.filter(
                assignment =>
                    !assignment.completed &&
                    isOverdue(assignment.deadline)
            );

    }


    // Display assignments

    if (filteredAssignments.length === 0) {

    assignmentList.innerHTML = `
        <div class="empty-state">

            <h3>No assignments found</h3>

            <p>
                Add an assignment using the form above.
            </p>

        </div>
    `;

    updateDashboard();

    return;
}


    filteredAssignments.forEach(
        assignment => {

            const card =
                document.createElement("div");

            card.className =
                "assignment-card";


            // Determine status

            let statusText;

            let statusClass;


            if (assignment.completed) {

                statusText = "Completed";

                statusClass = "completed";

            }

            else if (
                isOverdue(assignment.deadline)
            ) {

                statusText = "Overdue";

                statusClass = "overdue";

            }

            else {

                statusText = "Pending";

                statusClass = "pending";

            }


            card.innerHTML = `

    <h3>${assignment.title}</h3>

    <p>
        Subject: ${assignment.subject}
    </p>

    <p>
        Deadline: ${formatDate(assignment.deadline)}
    </p>

    <p class="deadline-message">
        ${getDeadlineMessage(assignment.deadline)}
    </p>

    <p class="${statusClass}">
        Status: ${statusText}
    </p>

    <div class="assignment-actions">

        ${
            !assignment.completed
            ?
            `<button
                class="complete-btn"
                onclick="completeAssignment(${assignment.id})">

                Complete

            </button>`
            :
            ""
        }

        <button
            class="edit-btn"
            onclick="editAssignment(${assignment.id})">

            Edit

        </button>

        <button
            class="delete-btn"
            onclick="deleteAssignment(${assignment.id})">

            Delete

        </button>

    </div>

`;


            assignmentList.appendChild(card);

        }
    );


    updateDashboard();

}


// Check if deadline is overdue

function isOverdue(deadline) {

    const today =
        new Date();

    today.setHours(0, 0, 0, 0);


    const deadlineDate =
        new Date(deadline);

    deadlineDate.setHours(0, 0, 0, 0);


    return deadlineDate < today;

}
function isDueToday(deadline) {

    const today = new Date();

    today.setHours(0, 0, 0, 0);


    const deadlineDate =
        new Date(deadline);

    deadlineDate.setHours(0, 0, 0, 0);


    return deadlineDate.getTime() ===
        today.getTime();

}
function isDueThisWeek(deadline) {

    const today = new Date();

    today.setHours(0, 0, 0, 0);


    const deadlineDate =
        new Date(deadline);

    deadlineDate.setHours(0, 0, 0, 0);


    const difference =
        deadlineDate - today;


    const days =
        difference /
        (1000 * 60 * 60 * 24);


    return days >= 0 && days <= 7;

}
function getDeadlineMessage(deadline) {

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const deadlineDate = new Date(deadline);
    deadlineDate.setHours(0, 0, 0, 0);

    const difference =
        deadlineDate - today;

    const days =
        Math.round(
            difference /
            (1000 * 60 * 60 * 24)
        );


    if (days < 0) {

        const overdueDays = Math.abs(days);

        if (overdueDays === 1) {
            return "1 day overdue";
        }

        return `${overdueDays} days overdue`;

    }


    if (days === 0) {
        return "Due today";
    }


    if (days === 1) {
        return "Due tomorrow";
    }


    return `Due in ${days} days`;

}

// Mark assignment as completed

function completeAssignment(id) {

    assignments =
        assignments.map(
            assignment => {

                if (assignment.id === id) {

                    assignment.completed = true;

                }

                return assignment;

            }
        );


    saveAssignments();

    displayAssignments();

}


// Delete assignment

function deleteAssignment(id) {

    assignments =
        assignments.filter(
            assignment =>
                assignment.id !== id
        );


    saveAssignments();

    displayAssignments();

}
// Edit assignment

function editAssignment(id) {

    const assignment =
        assignments.find(
            assignment =>
                assignment.id === id
        );

    if (!assignment) {
        return;
    }

    document.getElementById("title").value =
        assignment.title;

    document.getElementById("subject").value =
        assignment.subject;

    document.getElementById("deadline").value =
        assignment.deadline;

    document.getElementById("priority").value =
        assignment.priority;

    assignments =
        assignments.filter(
            assignment =>
                assignment.id !== id
        );

    saveAssignments();

    displayAssignments();

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}

// Format date

function formatDate(date) {

    const dateObject =
        new Date(date);


    return dateObject.toLocaleDateString(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }
    );

}


// Update dashboard

function updateDashboard() {

    const total =
        assignments.length;


    const completed =
        assignments.filter(
            assignment =>
                assignment.completed
        ).length;


    const overdue =
        assignments.filter(
            assignment =>
                !assignment.completed &&
                isOverdue(assignment.deadline)
        ).length;


    const pending =
        total - completed - overdue;


    const today =
        assignments.filter(
            assignment =>
                !assignment.completed &&
                isDueToday(assignment.deadline)
        ).length;


    const thisWeek =
        assignments.filter(
            assignment =>
                !assignment.completed &&
                isDueThisWeek(assignment.deadline)
        ).length;


    totalAssignments.textContent =
        total;


    pendingAssignments.textContent =
        pending;


    completedAssignments.textContent =
        completed;


    overdueAssignments.textContent =
        overdue;


    todayAssignments.textContent =
        today;


    weekAssignments.textContent =
        thisWeek;

}


// Filter assignments

filter.addEventListener(
    "change",
    displayAssignments
);
search.addEventListener(
    "input",
    displayAssignments
);


sort.addEventListener(
    "change",
    displayAssignments
);

// Display assignments when page loads

displayAssignments();
const clearAllBtn =
    document.getElementById("clearAllBtn");

clearAllBtn.addEventListener(
    "click",
    function () {

        if (assignments.length === 0) {
            alert("There are no assignments to clear.");
            return;
        }

        const confirmClear =
            confirm(
                "Are you sure you want to delete all assignments?"
            );

        if (!confirmClear) {
            return;
        }

        assignments = [];

        saveAssignments();

        displayAssignments();

    }
);