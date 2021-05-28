import {Component, OnDestroy, TemplateRef} from '@angular/core';
import {AutoCompleteService} from './autocomplete.service';
import {ActivatedRoute, Params, Router, RouterLink} from '@angular/router';
import {GalleryService} from '../gallery.service';
import {Subscription} from 'rxjs';
import {NavigationService} from '../../../model/navigation.service';
import {QueryParams} from '../../../../../common/QueryParams';
import {MetadataSearchQueryTypes, SearchQueryDTO, SearchQueryTypes, TextSearch} from '../../../../../common/entities/SearchQueryDTO';
import {BsModalService} from 'ngx-bootstrap/modal';
import {BsModalRef} from 'ngx-bootstrap/modal/bs-modal-ref.service';
import {SearchQueryParserService} from './search-query-parser.service';
import {AlbumsService} from '../../albums/albums.service';
import {Config} from '../../../../../common/config/public/Config';

@Component({
  selector: 'app-gallery-search',
  templateUrl: './search.gallery.component.html',
  styleUrls: ['./search.gallery.component.css'],
  providers: [AutoCompleteService, RouterLink]
})
export class GallerySearchComponent implements OnDestroy {

  public searchQueryDTO: SearchQueryDTO = {type: SearchQueryTypes.any_text, text: ''} as TextSearch;
  public rawSearchText = '';
  mouseOverAutoComplete = false;
  readonly SearchQueryTypes: typeof SearchQueryTypes;
  public readonly MetadataSearchQueryTypes: { value: string; key: SearchQueryTypes }[];
  public saveSearchName: string;
  AlbumsEnabled = Config.Client.Album.enabled;
  private searchModalRef: BsModalRef;
  private readonly subscription: Subscription = null;
  private saveSearchModalRef: BsModalRef;

  constructor(private autoCompleteService: AutoCompleteService,
              private searchQueryParserService: SearchQueryParserService,
              private galleryService: GalleryService,
              private albumService: AlbumsService,
              private navigationService: NavigationService,
              private route: ActivatedRoute,
              public router: Router,
              private modalService: BsModalService) {

    this.SearchQueryTypes = SearchQueryTypes;
    this.MetadataSearchQueryTypes = MetadataSearchQueryTypes.map((v) => ({key: v, value: SearchQueryTypes[v]}));

    this.subscription = this.route.params.subscribe((params: Params): void => {
      if (!params[QueryParams.gallery.search.query]) {
        return;
      }
      const searchQuery = JSON.parse(params[QueryParams.gallery.search.query]);
      if (searchQuery) {
        this.searchQueryDTO = searchQuery;
        this.onQueryChange();
      }
    });
  }

  get HTMLSearchQuery(): string {
    return JSON.stringify(this.searchQueryDTO);
  }


  ngOnDestroy(): void {
    if (this.subscription !== null) {
      this.subscription.unsubscribe();
    }
  }

  public async openSearchModal(template: TemplateRef<any>): Promise<void> {
    this.searchModalRef = this.modalService.show(template, {class: 'modal-lg'});
    document.body.style.paddingRight = '0px';
  }

  public hideSearchModal(): void {
    this.searchModalRef.hide();
    this.searchModalRef = null;
  }

  public async openSaveSearchModal(template: TemplateRef<any>): Promise<void> {
    this.saveSearchModalRef = this.modalService.show(template, {class: 'modal-lg'});
    document.body.style.paddingRight = '0px';
  }

  public hideSaveSearchModal(): void {
    this.saveSearchModalRef.hide();
    this.saveSearchModalRef = null;
  }


  onQueryChange(): void {
    console.log('cahnge', this.searchQueryDTO);
    this.rawSearchText = this.searchQueryParserService.stringify(this.searchQueryDTO);
    // this.validateRawSearchText();
  }


  validateRawSearchText(): void {
    try {
      this.searchQueryDTO = this.searchQueryParserService.parse(this.rawSearchText);
    } catch (e) {
      console.error(e);
    }
  }

  Search(): void {
    this.router.navigate(['/search', this.HTMLSearchQuery]).catch(console.error);
  }


  async saveSearch(): Promise<void> {
    await this.albumService.addSavedSearch(this.saveSearchName, this.searchQueryDTO);
    this.hideSaveSearchModal();
  }
}


