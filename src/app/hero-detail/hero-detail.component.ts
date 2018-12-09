import { Component, OnInit, Input } from '@angular/core';
import { Hero } from '../hero';

// ルーティングさせるために以下を追加
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { HeroService }  from '../hero.service';



@Component({
  selector: 'app-hero-detail',
  templateUrl: './hero-detail.component.html',
  styleUrls: ['./hero-detail.component.scss']
})


export class HeroDetailComponent implements OnInit {
    @Input() hero: Hero;

  constructor(
      private route: ActivatedRoute,　　　//このHeroDetailComponentのインスタンスへのルートに関する情報を保持
      private heroService: HeroService,  //リモートサーバーからヒーローのデータを取得し、 このコンポーネントはそれを使用して表示するヒーローを取得
      private location: Location         //ブラウザと対話するためのAngularサービス。 ここへナビゲートしたビューに戻るために、後で使用する
  ) { }

  ngOnInit() {
      this.getHero();
  }

    // route.snapshot:  コンポーネントが作成された直後のルート情報の静的イメージです。
    // paramMap:        URL から抽出されたルートパラメータ値の辞書です。 "id"キーは、フェッチするヒーローのidを返します。
    // ルートパラメータは常に文字列です。 JavaScript (+) 演算子は文字列を数値に変換します
    getHero(): void {
        const id = +this.route.snapshot.paramMap.get('id');
        this.heroService.getHero(id)
            .subscribe(hero => this.hero = hero);
    }
    save(): void {
        this.heroService.updateHero(this.hero)
            .subscribe(() => this.goBack());
    }
    goBack(): void {
        this.location.back();
    }

}
