import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AlertContainer } from './components/alert-container';
import { Footer } from './components/footer';
import { ModalContainer } from './components/modal-container/modal-container';
import { Navbar } from './components/navbar/navbar';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar, Footer, AlertContainer, ModalContainer],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {}
