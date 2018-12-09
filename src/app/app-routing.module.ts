import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

  import { HeroesComponent }      from './heroes/heroes.component';  //　追加
  import { DashboardComponent }   from './dashboard/dashboard.component';  //　追加

  import { HeroDetailComponent }  from './hero-detail/hero-detail.component';  //　追加

const routes: Routes = [
  // { path: '', redirectTo: 'home', pathMatch: 'full' },
  // { path: 'home', loadChildren: './home/home.module#HomePageModule' },
  { path: 'heroes', component: HeroesComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },

        // pathのコロン (:) は:idが特定のヒーローのidのプレースホルダーであることを表しています。
  { path: 'detail/:id', component: HeroDetailComponent },

];

@NgModule({
　
  imports: [
      // まず始めにルーターの初期化をおこない、ルーターにブラウザのロケーション変化の検知を始めさせます。
      // imports配列の中で　【RouterModule.forRoot()】　を呼び出すことでroutesを使ってそれを設定します：
      RouterModule.forRoot(routes)],
  exports: [
      RouterModule
  ]
})
export class AppRoutingModule { }
