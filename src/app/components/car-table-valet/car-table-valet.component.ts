// import { Component, OnInit } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';

// interface Car {
//   carID: string;
//   carModel: string;
//   carNumber: string;
//   phoneNumber: string;
//   status: string;
// }

// @Component({
//   selector: 'app-car-table-valet',
//   templateUrl: './car-table-valet.component.html',
//   standalone: true,
//   imports: [CommonModule, FormsModule],
// })
// export class CarTableValetComponent implements OnInit {
//   cars: Car[] = [];
//   filteredCars: Car[] = [];
//   searchTerm: string = '';

//   constructor(private http: HttpClient) {}

//   ngOnInit() {
//     this.fetchCars();
//   }

//   fetchCars() {
//     this.http.get<Car[]>('http://localhost:5221/api/SearchFunctionality/combined')
//       .subscribe(
//         (data) => {
//           this.cars = data;
//           this.filteredCars = data;
//         },
//         (error) => {
//           console.error('Error fetching cars:', error);
//         }
//       );
//   }

//   onSearch() {
//     const searchTerm = this.searchTerm.toLowerCase();
//     this.filteredCars = this.cars.filter(car =>
//       car.carID.toLowerCase().includes(searchTerm) ||
//       car.carModel.toLowerCase().includes(searchTerm) ||
//       car.carNumber.toLowerCase().includes(searchTerm) ||
//       car.phoneNumber.toLowerCase().includes(searchTerm)
//     );
//   }

//   clearSearch() {
//     this.searchTerm = '';
//     this.filteredCars = this.cars;
//   }

//   toggleCarStatus(carID: string) {
//     const car = this.cars.find(c => c.carID === carID);
//     if (car) {
//       car.status = car.status === 'parked' ? 'unparked' : 'parked';
//       this.updateCarStatus(car);
//     }
//   }

//   updateCarStatus(car: Car) {
//     this.http.put(`http://localhost:5221/api/SearchFunctionality/updateStatus/${car.carID}`, { status: car.status })
//       .subscribe(
//         () => {
//           console.log('Car status updated successfully');
//         },
//         (error) => {
//           console.error('Error updating car status:', error);
//         }
//       );
//   }
// }






import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Car {
  carID: string;
  carModel: string;
  carNumber: string;
  phoneNumber: string;
  status: string;
  statusID: string;
}

@Component({
  selector: 'app-car-table-valet',
  templateUrl: './car-table-valet.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class CarTableValetComponent implements OnInit {
  cars: Car[] = [];
  filteredCars: Car[] = [];
  searchTerm: string = '';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.fetchCars();
  }

  fetchCars() {
    this.http.get<Car[]>('http://localhost:5221/api/SearchFunctionality/combined')
      .subscribe({
        next: (data) => {
          // Map the statusID to status display value
          this.cars = data.map(car => ({
            ...car,
            status: this.getStatusFromId(car.statusID)
          }));
          this.filteredCars = this.cars;
        },
        error: (error) => {
          console.error('Error fetching cars:', error);
        }
      });
  }

  getStatusFromId(statusId: string): string {
    const statusMap: { [key: string]: string } = {
      'STATUS001': 'parked',
      'STATUS002': 'unparked',
      'STATUS003': 'in-transit'
    };
    return statusMap[statusId] || statusId;
  }

  getIdFromStatus(status: string): string {
    const reverseMap: { [key: string]: string } = {
      'parked': 'STATUS001',
      'unparked': 'STATUS002',
      'in-transit': 'STATUS003'
    };
    return reverseMap[status as keyof typeof reverseMap] || status;
  }

  onSearch() {
    const searchTerm = this.searchTerm.toLowerCase();
    this.filteredCars = this.cars.filter(car =>
      car.carID.toLowerCase().includes(searchTerm) ||
      car.carModel.toLowerCase().includes(searchTerm) ||
      car.carNumber.toLowerCase().includes(searchTerm) ||
      car.phoneNumber.toLowerCase().includes(searchTerm)
    );
  }

  clearSearch() {
    this.searchTerm = '';
    this.filteredCars = this.cars;
  }

  toggleCarStatus(carID: string) {
    const car = this.cars.find(c => c.carID === carID);
    if (car) {
      const newStatus = car.status === 'parked' ? 'unparked' : 'parked';
      const newStatusId = this.getIdFromStatus(newStatus);

      this.http.patch('http://localhost:5221/api/cars', {
        id: carID,
        statusId: newStatusId
      }).subscribe({
        next: () => {
          car.status = newStatus;
          car.statusID = newStatusId;
          console.log('Car status updated successfully');
        },
        error: (error) => {
          console.error('Error updating car status:', error);
        }
      });
    }
  }
}

