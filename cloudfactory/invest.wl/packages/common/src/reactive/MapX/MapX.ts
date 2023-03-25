import { DMapX, DMapXList, DMapXListProxy, DMapXProxy } from './D.MapX';
import { MapXBase, MapXListBase } from './MapX.base';
import { VMapX, VMapXList, VMapXListProxy, VMapXProxy } from './V.MapX';

export class MapX {
  public static Base = MapXBase;
  public static BaseList = MapXListBase;

  // domain
  public static D = DMapX;
  public static DList = DMapXList;
  public static DProxy = DMapXProxy;
  public static DProxyList = DMapXListProxy;

  // view
  public static V = VMapX;
  public static VList = VMapXList;
  public static VProxy = VMapXProxy;
  public static VProxyList = VMapXListProxy;
}

