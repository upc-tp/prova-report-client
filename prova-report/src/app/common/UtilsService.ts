import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class UtilsService {
    padTo2Digits(num: number): string {
        return num.toString().padStart(2, '0');
    }
    
    padTo3Digits(num: number): string {
        return num.toString().padStart(3, '0');
    }
    
    
    formatDateTime(date: Date): string {
        const strDate = [
            this.padTo2Digits(date.getDate()),
            this.padTo2Digits(date.getMonth() + 1),
            date.getFullYear()
        ].join('/');
        const strTime = [
            this.padTo2Digits(date.getHours()),
            this.padTo2Digits(date.getMinutes()),
            this.padTo2Digits(date.getSeconds())
        ].join(':');
        return `${strDate} ${strTime}`;
    }
    
    formatDate(date: Date): string {
        const strDate = [
            this.padTo2Digits(date.getDate()),
            this.padTo2Digits(date.getMonth() + 1),
            date.getFullYear()
        ].join('/');
        const strTime = [
            this.padTo2Digits(date.getHours()),
            this.padTo2Digits(date.getMinutes()),
            this.padTo2Digits(date.getSeconds()),
            this.padTo3Digits(date.getMilliseconds())
        ].join(':');
        return `${strDate} ${strTime}`;
    }
    
    formatTime(milliseconds: number): string {
        const seconds = milliseconds / 1000;
        const minutes = seconds / 60;
        const hours = minutes / 60;
        const strTime = [
            this.padTo2Digits(Math.floor(hours)),
            this.padTo2Digits(Math.floor(minutes)),
            this.padTo2Digits(Math.floor(seconds)),
            this.padTo3Digits(milliseconds).slice(0,3)
        ].join(':');
        return strTime;
    }
}