import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { Hero } from './hero';
import { HEROES } from './mock-heroes';
import { MessageService } from './message.service';

//ルーティング関連
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';


/**
 *  ヒーローWeb APIはHTTPの保存リクエストのとき特別なヘッダーを期待します。
 * そのヘッダーはHeroServiceの定数httpOptionsで定義されています。
 * */
const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};


@Injectable({
    providedIn: 'root',
})
export class HeroService {

    private heroesUrl = 'api/heroes';  // Web APIのURL

    constructor(
        private http: HttpClient,
        private messageService: MessageService
    ) { }

    //モック版のヒーローを取得している
    // RxJSのof()を使って、モックのヒーロー配列をObservable<Hero[]>として返します。

    // getHeroes(): Observable<Hero[]> {
    //     // TODO: send the message _after_ fetching the heroes
    //     this.messageService.add('HeroService: fetched heroes');
    //     return of(HEROES);
    // }


    /** サーバーからヒーローを取得する */
    getHeroes (): Observable<Hero[]> {
        return this.http.get<Hero[]>(this.heroesUrl)

        　　　// observableの結果をpipe()で拡張
            .pipe(
                tap(heroes => this.log('fetched heroes')),
                // HeroServiceのメソッドはObservableな値の流れに入り込んで、(log()を通して)ページ下部にメッセージを送信
                // RxJSのtapオペレーターを使って行う
                catchError(this.handleError('getHeroes', []))
            );
    }

    /** 旧式 */
    // getHero(id: number): Observable<Hero> {
    //     // TODO: send the message _after_ fetching the hero
    //     this.messageService.add(`HeroService: fetched hero id=${id}`);
    //     return of(HEROES.find(hero => hero.id === id));
    // }
    /** IDによりヒーローを取得する。idが見つからない場合は`undefined`を返す。 */
    getHeroNo404<Data>(id: number): Observable<Hero> {
        const url = `${this.heroesUrl}/?id=${id}`;
        return this.http.get<Hero[]>(url)
            .pipe(
                map(heroes => heroes[0]), // {0|1} 要素の配列を返す
                tap(h => {
                    const outcome = h ? `fetched` : `did not find`;
                    this.log(`${outcome} hero id=${id}`);
                }),
                catchError(this.handleError<Hero>(`getHero id=${id}`))
            );
    }

    /** IDによりヒーローを取得する。見つからなかった場合は404を返却する。 */
    getHero(id: number): Observable<Hero> {
        const url = `${this.heroesUrl}/${id}`;
        return this.http.get<Hero>(url).pipe(
            tap(_ => this.log(`fetched hero id=${id}`)),
            catchError(this.handleError<Hero>(`getHero id=${id}`))
        );
    }

    /** 検索語を含むヒーローを取得する */
    searchHeroes(term: string): Observable<Hero[]> {
        if (!term.trim()) {
            // 検索語がない場合、空のヒーロー配列を返す
            return of([]);
        }
        return this.http.get<Hero[]>(`${this.heroesUrl}/?name=${term}`).pipe(
            tap(_ => this.log(`found heroes matching "${term}"`)),
            catchError(this.handleError<Hero[]>('searchHeroes', []))
        );
    }


    /** POST: サーバーに新しいヒーローを登録する */
    /**
     * HttpClient.POST()
     * ・put()の代わりにHttpClient.post()を呼び出します。
     * ・サーバーで新しいヒーローのIDが生成されることを期待します。そしてそれは呼び出し元にObservable<Hero>として戻ります。
     */
    addHero (hero: Hero): Observable<Hero> {
        return this.http.post<Hero>(this.heroesUrl, hero, httpOptions).pipe(
            tap((hero: Hero) => this.log(`added hero w/ id=${hero.id}`)),
            catchError(this.handleError<Hero>('addHero'))
        );
    }

    /** PUT: サーバー上でヒーローを更新 */
    /**
     * HttpClient.put()メソッドは3つのパラメーターを取ります。
     * ・URL
     * ・アップデート用のデータ (今回の場合は編集されたヒーロー)
     * ・オプション
     */
    updateHero (hero: Hero): Observable<any> {
        return this.http.put(this.heroesUrl, hero, httpOptions).pipe(
            tap(_ => this.log(`updated hero id=${hero.id}`)),
            catchError(this.handleError<any>('updateHero'))
        );
    }


    /** DELETE: サーバーからヒーローを削除 */
    /**
     * HttpClient.delete()
     * ・URLはヒーローリソースのURLと削除するヒーローのid
     * ・putやpostで行っていたようなデータ送信はしません。
     * ・httpOptionsは送信しています。
     */
    deleteHero (hero: Hero | number): Observable<Hero> {
        const id = typeof hero === 'number' ? hero : hero.id;
        const url = `${this.heroesUrl}/${id}`;

        return this.http.delete<Hero>(url, httpOptions).pipe(
            tap(_ => this.log(`deleted hero id=${id}`)),
            catchError(this.handleError<Hero>('deleteHero'))
        );
    }



    /**
     * 失敗したHttp操作を処理します。
     * アプリを持続させます。
     * @param operation - 失敗した操作の名前
     * @param result - observableな結果として返す任意の値
     */
    private handleError<T> (operation = 'operation', result?: T) {
        return (error: any): Observable<T> => {

            // TODO: リモート上のロギング基盤にエラーを送信する
            console.error(error); // かわりにconsoleに出力

            // TODO: ユーザーへの開示のためにエラーの変換処理を改善する
            this.log(`${operation} failed: ${error.message}`);

            // 空の結果を返して、アプリを持続可能にする
            return of(result as T);
        };
    }

    /** HeroServiceのメッセージをMessageServiceを使って記録 */
    private log(message: string) {
        this.messageService.add(`HeroService: ${message}`);
    }
}