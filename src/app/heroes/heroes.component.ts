import { Component, OnInit } from '@angular/core';
import { Hero } from '../hero';
// import { HEROES } from '../mock-heroes';

import { HeroService } from '../hero.service';

// @Componentは、コンポーネントのAngularメタデータを指定するデコレーター関数
@Component({
  selector: 'app-heroes',                   //コンポーネントのCSS要素セレクター
  templateUrl: './heroes.component.html',   //コンポーネントのテンプレートファイルの場所
  styleUrls: ['./heroes.component.scss']    //コンポーネントのプライベートCSSスタイルの場所
})
export class HeroesComponent implements OnInit {

    // selectedHero: Hero;　　//ルーティングにより不要のため削除
    //heroesという名前のコンポーネントプロパティを定義して、バインディングのために HEROES 配列を公開
    // heroes = HEROES;
    heroes: Hero[];



  constructor(
      // HeroService 型のプライベートプロパティである heroService をコンストラクターに追加
      private heroService: HeroService
  ) { }


  /*
    OnInit()
    ngOnInit() を使う主な理由は2つあります。

    構築直後に複雑な初期化を実行する。
    Angularが入力プロパティを設定した後コンポーネントを設定する。
    経験豊富な開発者は、コンポーネントを安価で安全に構築する必要があることに同意します。

    getHeroes() はコンストラクターでも呼び出すことはできますが、これは最適な方法ではない
    Angular が HeroesComponent インスタンスを生成した後、適切なタイミングで呼び出されます
  */
  ngOnInit() {
      this.getHeroes();
  }

  // クリックイベントのハンドラー　　//ルーティングにより不要のため削除
  // onSelect(hero: Hero): void {
  //     this.selectedHero = hero;
  // }

    getHeroes(): void {
    // this.heroes = this.heroService.getHeroes();

      this.heroService.getHeroes()
          .subscribe(heroes => this.heroes = heroes);
  }

    add(name: string): void {
        name = name.trim();
        if (!name) { return; }
        this.heroService.addHero({ name } as Hero)
            .subscribe(hero => {
                this.heroes.push(hero);
            });
    }

    delete(hero: Hero): void {
        this.heroes = this.heroes.filter(h => h !== hero);
        // もしsubscribe()をし忘れると、サービスはDELETEリクエストをサーバーに送信しません！
        this.heroService.deleteHero(hero).subscribe();
    }
}
