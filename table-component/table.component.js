//@ts-nocheck
tableController.$inject = ["$scope", "$location", "$http"];

angular.module("bankAdmin").component("tableCom", {
  controller: tableController,
  controllerAs: "tableController",
  templateUrl: "./table-component/table.component.html",
});

function tableController($scope, $location, $http) {
  $scope.sc = true;
  $scope.checkDates = function () {
    if ($scope.date1 == undefined || $scope.date2 == undefined) {
      $scope.sc = true;
    } else {
      $scope.sc = false;
    }
  };

  $scope.rest = function () {
    $scope.sc = true;
  };
  this.buildDatePicker = (startInput, endInput) => {
    const container = document.getElementById("calendar-container");
    const minDate = new Date();
    minDate.setHours(0, 0, 0, 0);

    this.startPicker = new Pikaday({
      bound: false,
      container: container,
      field: startInput,
      firstDay: 1,
      theme: "calendar__start-wrapper",
      format: "DD-MM-yyyy",
      minDate: minDate,
      onSelect: () => {
        this.updateStartDate(this.startPicker.getDate());
      },
    });

    this.endPicker = new Pikaday({
      bound: false,
      container: container,
      field: endInput,
      firstDay: 1,
      format: "DD-MM-yyyy",
      theme: "calendar__end-wrapper",
      minDate: minDate,
      onSelect: () => {
        this.updateEndDate(this.endPicker.getDate());
      },
    });

    this.endPicker.hide();
    this.bindReset(startInput, endInput);
    this.bindMouseMove(endInput, container);
  };

  this.updateStartDate = (selectedDate) => {
    this.startPicker.hide();
    this.endPicker.setMinDate(selectedDate);
    this.endPicker.setStartRange(selectedDate);
    this.endPicker.gotoDate(selectedDate);
    this.setEndRange(selectedDate);
    this.endPicker.show();
  };

  this.updateEndDate = (selectedDate) => {
    this.endDate = new Date(selectedDate);
    this.setEndRange(selectedDate);
  };

  this.setEndRange = (endDate) => {
    this.endPicker.setEndRange(endDate);
    this.endPicker.draw();
  };

  this.bindReset = (startInput, endInput) => {
    const reset = document.getElementById("calendar-clear");
    reset.addEventListener("click", (event) => {
      event.preventDefault();

      this.endPicker.setDate(null);
      this.updateEndDate(null);
      endInput.value = null;

      this.startPicker.setDate(null);
      this.updateStartDate(null);
      this.startPicker.gotoDate(new Date());
      startInput.value = null;

      this.endPicker.hide();
      this.startPicker.show();
    });
  };

  this.bindMouseMove = (endInput, container) => {
    this.target = false;

    document.querySelector("body").addEventListener("mousemove", (btn) => {
      if (!btn.target.classList.contains("pika-button")) {
        if (this.target === true) {
          this.target = false;
          this.setEndRange(this.endPicker.getDate());
        }
      } else {
        this.target = true;
        const pikaBtn = btn.target;
        const pikaDate = new Date(
          pikaBtn.getAttribute("data-pika-year"),
          pikaBtn.getAttribute("data-pika-month"),
          pikaBtn.getAttribute("data-pika-day")
        );
        this.setEndRange(pikaDate);
      }
    });
  };

  const start = document.getElementById("calendar-start");
  const end = document.getElementById("calendar-end");

  this.buildDatePicker(start, end);

  // search dates function
  $scope.SearchDates = function () {
    $scope.arr = []; // this is my array
    $scope.mArry = []; // scoping array
    $scope.currentPage = 1;
    $scope.ItemPerPage = 5;

    let StartD = $scope.date1.split("-");
    let StartDD = StartD[2] + "-" + StartD[1] + "-" + StartD[0];

    let StartDDObj = new Date(StartDD);
    let StartDDObjMil = Date.parse(StartDDObj);

    let EndD = $scope.date2.split("-");
    let EndDD = EndD[2] + "-" + EndD[1] + "-" + EndD[0];

    let EndDDObj = new Date(EndDD);
    EndDDObj = EndDDObj.toString();

    let EndDDObjMil = Date.parse(EndDDObj.slice(0, 15));

    $http.get("../data.json").then((response) => {
      response.data.forEach((element) => {
        let e = element;
        let ed = e.registered.split("-");
        let MyModiDate = ed[2] + "-" + ed[1] + "-" + ed[0];
        let Dobj = new Date(MyModiDate);
        Dobj = Dobj.toString();
        let DoMili = Date.parse(Dobj.slice(0, 15));

        //  upto this json dates
        $scope.arr.push(element);
        if (DoMili >= StartDDObjMil && DoMili <= EndDDObjMil) {
          $scope.mArry.push(element);
        }
      });

      if ($scope.mArry.length == 0) {
        const obj = {
          balance: "No record",
          age: "No record",
          name: "No record",
          gender: "No record",
          email: "No record",
          phone: "No record",
          registered: "No record",
        };

        $scope.mArry.push(obj);
      }

      // up to this not touched
      $scope.left_arrow = false;
      $scope.right_arrow = false;
      let BC = $scope.mArry.length / 5;

      let SIGNAl = false; // this is for how many buttons are should be there
      $scope.button = []; // this one i have to make dynamic
      $scope.mainArr = []; // the length of the array is 5

      for (let i = 0; i < BC; i++) {
        $scope.button.push(i + 1);
      } // this is for loading up the button array

      let lengthOfTheButtonArray = $scope.button.length;

      const ShowButtons = (startIndex, endIndex) => {
        for (let i = startIndex; i < endIndex; i++) {
          $scope.mainArr.push($scope.button[i]);
        }
      };
      // this is jsut pusing it to main array

      if (lengthOfTheButtonArray <= 5) {
        ShowButtons(0, lengthOfTheButtonArray); // this is for if does not have many
        SIGNAl = false;
      } else {
        SIGNAl = true;
        ShowButtons(0, 5);
      }

      const show_oribi = (indexNumber, val) => {
        console.log("the value is: " + val);
        if (SIGNAl) {
          $scope.mainArr = [];
          if (val === 1 || val === 2 || val === 3) {
            for (let i = 0; i < 5; i++) {
              $scope.mainArr.push(i + 1);
            }
          } else {
            for (let i = val - 2; i < val + 3; i++) {
              if (i > lengthOfTheButtonArray) break;
              $scope.mainArr.push(i);
            }
          }
        }
      };

      $scope.currentPage = 1;
      $scope.maxItem = 5;

      $scope.showIndex = function (index, val) {
        $scope.currentPage = val; // 2
        if ($scope.currentPage > 1) {
          $scope.left_arrow = true;
          $scope.right_arrow = true;
        }
        if ($scope.currentPage === lengthOfTheButtonArray) {
          $scope.right_arrow = false;
        }

        if ($scope.currentPage == 1) {
          $scope.left_arrow = false;
        }
        $scope.end = $scope.currentPage * 5;
        $scope.start = $scope.end - 5;
        console.log($scope.end, $scope.start, index);
        show_oribi(index, val);
        showArr($scope.start, $scope.end);
      };

      $scope.arrowMoverLeft = function () {
        console.log("calling arrowMoverLeft: " + $scope.currentPage);
        console.log("this start point " + $scope.start);
        console.log("this end point " + $scope.end);
        console.log("---arrow left end---");
        if ($scope.currentPage != 1) {
          $scope.currentPage -= 1;
          $scope.start -= 5;
          $scope.end -= 5;
          showArr($scope.start, $scope.end);
          show_oribi(1, $scope.currentPage);
        }
        if ($scope.currentPage == 1) {
          $scope.left_arrow = false;
        }
      };

      $scope.arrowMoverRight = function () {
        console.log("calling arrowMoverRight: " + $scope.currentPage);
        console.log("this start point " + $scope.start);
        console.log("this start point " + $scope.end);
        console.log("---arrow right end---");

        if ($scope.currentPage != lengthOfTheButtonArray) {
          $scope.currentPage += 1;
          $scope.start += 5;
          $scope.end += 5;
          showArr($scope.start, $scope.end);
          show_oribi(1, $scope.currentPage);
        }
        if ($scope.currentPage == lengthOfTheButtonArray) {
          $scope.right_arrow = false;
        }
      };

      function showArr(start, end) {
        $scope.showItems = [];

        for (let i = start; i < end; i++) {
          if (i > $scope.arr.length) {
            break;
          } else {
            $scope.showItems.push($scope.mArry[i]);
          }
        }
      }

      showArr(0, 5);

      // this is for table opacity
      $scope.tble = {
        opacity: "1",
      };
    });
  };

  //  Thu Jul 23 2020
  // Fri Jul 31 2020
}
