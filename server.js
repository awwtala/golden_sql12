const inquirer = require("inquirer");
const pg = require("pg");

async function startApp() {
  // create a pool
  const pool = new pg.Pool({
    host: "localhost",
    user: "postgres",
    password: "ta94",
    database: "sql12",
    port: 5432,
  });

  const db = await pool.connect();
  //----------------------

  function getAllDepartments() {
    // send a query to the database
    // SELECT * FROM department;
    db.query("SELECT * FROM department;", function (err, data) {
      if (err) {
        console.log(err);
        process.exit(1);
      } else {
        console.table(data.rows);
        mainMenu();
      }
    });
  }

  function addNewDepartment() {
    inquirer
      .prompt([
        {
          type: "input",
          name: "dept_name",
          message: "What is the name of the new department?",
        },
      ])
      .then((answers) => {
        db.query(
          "INSERT INTO department(name) VALUES ($1)",
          [answers.dept_name],
          function (err, data) {
            if (err) {
              console.log(err);
              process.exit(1);
            } else {
              console.log("New department has been added!");
              mainMenu();
            }
          }
        );
      });

    //-------------------------
  }
  function getAllRole() {
    // send a query to the database
    // SELECT * FROM department;
    db.query("SELECT * FROM role;", function (err, data) {
      if (err) {
        console.log(err);
        process.exit(1);
      } else {
        console.table(data.rows);
        mainMenu();
      }
    });
  }

  function addNewRole() {
    inquirer
      .prompt([
        {
          type: "input",
          name: "role_name",
          message: "What is the name of the role?",
        },
        {
          type: "input",
          name: "role_salary",
          message: "What is the salary of the role?",
        },
        {
          type: "input",
          name: "department_id",
          message: "What is your department ID?",
        },
      ])
      .then((answers) => {
        db.query(
          "INSERT INTO role(name, salary, department_id) VALUES ($1, $2, $3)",
          [answers.role_name, answers.role_salary, answers.department_id],
          function (err, data) {
            if (err) {
              console.log(err);
              process.exit(1);
            } else {
              console.log("New role has been added!");
              mainMenu();
            }
          }
        );
      });
  }

  //----------------------------
  function getAllEmployee() {
    db.query("SELECT * FROM employee;", function (err, data) {
      if (err) {
        console.log(err);
        process.exit(1);
      } else {
        console.table(data.rows);
        mainMenu();
      }
    });
  }

  function addNewEmployee() {
    inquirer
      .prompt([
        {
          type: "input",
          name: "employee_name",
          message: "What is your first name?",
        },
        {
          type: "input",
          name: "employee_lastName",
          message: "What is your last name?",
        },
        {
          type: "input",
          name: "employee_role",
          message: "What is your role as an employee?",
        },
        {
          type: "input",
          name: "employee_managerID",
          message: "What is your manager ID?",
          default: 0,
        },
      ])
      .then((answers) => {
        db.query(
          "INSERT INTO employee(first_name, last_name, role_id, manager_id) VALUES ($1,$2,$3,$4)",
          [
            answers.employee_name,
            answers.employee_lastName,
            answers.employee_role,
            answers.employee_managerID,
          ],
          function (err, data) {
            if (err) {
              console.log(err);
              process.exit(1);
            } else {
              console.log("New employee has been added!");
              mainMenu();
            }
          }
        );
      });
  }
  function updateEmployee() {
    inquirer
      .prompt([
        {
          type: "input",
          name: "employee_id",
          message: "What is the Id of the employee you would like to update?",
        },
        {
          type: "input",
          name: "role_id",
          message: "What is the ID of the role?",
        },
      ])
      .then((answers) => {
        db.query(
          "UPDATE employee SET role_id = ($2) WHERE id = ($1)",
          [answers.employee_id, answers.role_id],
          function (err, data) {
            if (err) {
              console.log(err);
              process.exit(1);
            } else {
              console.log("The employee has been updated!");
              mainMenu();
            }
          }
        );
      });
  }
  //----------------------------
  function mainMenu() {
    inquirer
      .prompt([
        {
          type: "list",
          name: "Action",
          message: "What would you like to do?",
          choices: [
            "view all departments",
            "view all roles",
            "view all employees",
            "add a department",
            "add a role",
            "add an employee",
            "update an employee role",
          ],
        },
      ])
      .then((answers) => {
        if (answers.Action == "view all departments") {
          getAllDepartments();
        }

        if (answers.Action == "add a department") {
          addNewDepartment();
        }
        if (answers.Action == "view all roles") {
          getAllRole();
        }
        if (answers.Action == "add a role") {
          addNewRole();
        }
        if (answers.Action == "view all employees") {
          getAllEmployee();
        }
        if (answers.Action == "add an employee") {
          addNewEmployee();
        }
        if (answers.Action == "update an employee role") {
          updateEmployee();
        }
      });
  }

  mainMenu();
}

startApp();
