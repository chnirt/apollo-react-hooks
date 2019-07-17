import React from 'react'
import { Button, List } from 'antd'
import './index.css'
import { Select, Divider, Icon, Collapse } from 'antd'
import gql from 'graphql-tag'
import openNotificationWithIcon from '../../../components/shared/openNotificationWithIcon'
// import logo from '../../../assets/images/logoClinic.svg'
import font from '../../../assets/fonts/Vietnamese.ttf'
// import './Lobster-Regular-normal'
import ListMenu from './listMenu'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import { HOCQueryMutation } from '../../../components/shared/hocQueryAndMutation'

class Report extends React.Component {
	state = {
		isActive: false,
		menuId: '',
		userId: '',
		usersId: [],
	}

	componentDidMount() {
		// this.props.
	}

	isActive = menuId => {
		this.props.mutate
			.closeMenu({
				mutation: CLOSE_MENU,
				variables: {
					id: menuId
				},
				refetchQueries: [
					{
						query: GET_MENU_BY_SITE,
						variables: {
							siteId: localStorage.getItem('currentsite')
						}
					}
				]
			})
			.then(({ data }) => {
				openNotificationWithIcon('success', 'login', 'Close Menu Success')
			})
			.catch(err => {
				console.log(err)
				throw err
			})

	}

	isLock = menuId => {
		this.props.mutate
			.lockAndUnLockMenu({
				mutation: LOCK_AND_UNLOCK_MENU,
				variables: {
					id: menuId
				},
				refetchQueries: [
					{
						query: GET_MENU_BY_SITE,
						variables: {
							siteId: localStorage.getItem('currentsite')
						}
					}
				]
			})
			.then(data => {
				// console.log(data)
				openNotificationWithIcon('success', 'success', 'Success')
			})
			.catch(err => {
				// console.log(err)
				throw err
			})
	}

	onRequest(menu) {
		var doc = new jsPDF({
			// orientation: 'landscape',
			unit: 'in',
			format: 'a4'
		})

		// doc.addFont('./Lobster-Regular-normal', 'Lobster', 'bold')
		doc.setFont('courier', 'bold')

		// doc.addFileToVFS("Lobster-Regular.ttf", Lobster);
		// doc.addFont('Lobster-Regular.ttf', 'Lobster', 'normal');
		// doc.setFont('Lobster'); 

		console.log(doc.getFontList())

		doc.addImage('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJYAAAAsCAYAAACHUEHxAAAWPElEQVR4nO2deZgcxXXAf69n9tRqtVqErPBhfURRCCaOwHyYy5hgTLBxnBgTxCV8aEbC3JcsC4UwwzRgDkW2QUYgiWljg8AHnw3mPk24bA4LoU8G2QFZxohssEBIKKvVbk+//NE9PX3P7AriP8L7vtrp6nr13quqV69eHV0rqoqY1t7AIuAwoJM6KEu1XDiXAEjFmoqwCDgK6PHw3gRuRbSspeIgYwAxrR5UL0fkeGBSIOk1LRX+KoJroHoBIl8DpgIGyjaEh1EWaLmwfiwyAEilehwiC4G9gbyfoHWEjLjQHKJ4jfgwyhvAs4j+BORuLRXsMZXBtA5COQnhUGAaSk+m3KMrx2otFT4e4ndh9SiUPgQH6AZ+nhfTmo7qU0BfXEKMiMCTQZ9C2T2CuRvwdZQZYlpHa6ngZIoWZVOxDND7gENRjSbn4zn0euDUCG4fynHAYWJaB2qpsGE0MgCIac0BViTIEGCdEc/I1gKNPDAdmI5yMuhLUrFO13Lh8RapugZCdQlwRFPZxl6OUHvIghsPQOQNhN2AHpRbEY4xQC9C6EPE1VQB9zlJbfVchN0buB5e4/ko0AszxUoC4Z8ROTTGv/4cRDWtj4KcGsf1w2TQlWJaCQqZIYJpdYIuCvMO8kiRLVhXiXiRd2SkhfPujegjYlbPaFH+40CfQ+SIUfAYQzkieiEyVa8srkX5G+A1hMOBrQbIfg3bV6fmgUaVS/YP45L0XBHTOqiVymjw0Y8n8k+2yYck44bkPASlPCoZ4KMgAasd1KwWZJM0vMi7WIfN5JEHuU4q1pezBBfTOga4DaR7DDxGWY4IqCIXVg1Eu4EDUV2Fat5AaUchMUTpKPlGupL8TB7VlWJWe9MqIgYSpEucbliIzgSe8XxwoZjWYS3LAJ1xmk14tIw71nx++a8X05qWWHWmNQ3l++lt856X442wADyG6ikg8/TK4kWIdIIMGogSD7i/0Vatvw/iCJFnBWEasCyjEaPVk0E7qlkSwUmQ2/3NAzeLafW3JIIm8I39BssbLX/0fSv5WubRDVpJEXwRor3vAY8Wy6HfC3G/cs4mRO5F9VhZUD0W6NerinfnE81bvQETvbgs/FD6iWJWH9BS8aaUDE1op/EZVdpUYAXwLzvPfzTxVumMiubxUrHO1nLhHf+NaU0DOYYYvC/lcFCu1HLh9ig3vbK4Cfhx8J1rPv1xr/5bpxVhqtFIEDeYXk+TJWJaT2up8LuoMDEIybGzuKG0Y8W0TtNS4YbmdKM0g3G9A+Qh14Im+xq+5Y1mT6xeP9IOfBw4DtV2N82jE5anHfQI4KcBDsei9Zm7uu3l1w2ADCLcBPwmxFNhdOXQIeBxLRdfiWdIhrxLIGZtGnIEQdIiEnnlP/QAt4lpHaylwnCqFH4ZW1SqprixtMViVh/XUvGl9CxJ9EJlrGipsLq5gGMDqVQXI/IQ0Bi6Yx1b9opkOzhW5426sYFPa6nwq/de2uZguBqqxH7xxtQgqMYDGc9ufD/gikwpJIFuiE4QlyQezeLdKLdJpdpJGrRC830ELRdXAedmyiBMjOSamtoWqvf/uZQKwAh7a3VIsWCJaxrSSEukI6CcJxXrs9miSCB7gEfMikZNeJLXGU0DRGYAi7NliNILvHNGteY7NlBuB4bD/IPyxIaQfKyuGssF7/BnhMgiYqQyMztpii8WVQa3PgyE74lp7aOlwpsxUtHhzXdrImN9No9kecLxM6RSfUDLxZ8n0tT0cog6/i6EmNWpIM81fCd1gA3AdVou3pIgcUug5cKQVKxt+MNhE9cENiW4H3id9EgxrV4tFbaOVZ6dgbxrPr1Y9DfaqNnDwSDuPlEyKFOA74tp/WPilk8a7fhrIwPXAYYJ7nfGoSqX3PgxvWTO63E+mtqZxAkl5FGdHJFvCnCQXHLjHnrJnMsy+DeBBBnSq30NqkemkJkC3CcVax7COhTHbc9A4zY6huf465CWi+m+8CjACC/r138l3oM9WVJxRR5E5P7EbYJG+CzKedlyxOjGsdN4gIPqvHhaMA+TELnZKC03IkQTaAbiQWX2J71BPD9+cduCaye33gQJkFYXqhGZuSd5a8bPewjCL0E3I7oF2IJ6Aba473QLIl6c7WJW/ygVa6WY1ufFtKL8WgYj2VxF30UhKV0dYDaqb4bpRILoFWJa+6XTbEWGqKwN/Im//c8bUO6Ovg/RETlc8/nQnma+uwO6OqG7E3q6YHw39PbAhB7oG09P/wTfbejfbVeDXfth136Y3A+Td/FCP3xol/b87n9xQILQrUFnO7TlIZcDqberJ3tUsZTHQNclt11K3HffEvEMYHdETwa9C/TXYlpjKkvEeY+EmLFIwmukaakwgOpsd0hKo0s7cJuY1Z5GuTQFN8ojKEeSPPD2bVc54jhFcrkBOjqguwt6xkHveJjYC7v0wa4TYXJ/pWvZHYfUKXb09RiMHwc93W6erk7o7ICOdmhvw2jLN3ysnAGGAUaiVUb89agxQF8v9E+ASRM9pe13n/snkO8bH1IsLRcckAXZdZdWV62kyb7AE1KpzhltMYzkaT4Jsy8S8DRgGNweoJfMuRfVpanLBy7uniBLmtPOmOaL4fbszg5XGSb0uEoDOJW5b3bs0jebCT0O47tdK9TlKgj5XH24yO+AlX3L7ugD0ODEIdxfPPkarxzHyZRXazuxNJFUdsOAfB4JKLePXir83OgbfyO942BcF3R1hMtZlz27PbJw2oFlYlqnjKYYKRYLYkrlQ7rFqkPbtncXoLo2sxcpXxWzemI63brVDMuRq/fmXSe6Fqh3nKs4He1uZXowdNox9+dUr00cNb24Knu86+gyAKfeiEmjCeAElKVWc6BZGCtk0bRriT5PtyFnimH8lHzOVaquDlfJese5w/n4QB215V1FHZ3lMlCWiWlFF2hTwfDpRSFZr1py5ob//fzB3PDwLNChEL3g2C4Acr2Y1T0AA8EdWtrz0N3h+jgTxyO79IV55nOG58g2tW4TRuyFYtdWY9dIC07NOb5tye0Fx645mXh2zadbs2tQSw8awB01jIHuu2cdNzzRkJkGXIzqcGzR1BDPure7Cja+G9+Sd7ZBW84b1gNE4+3fjbKo1WIYGe5K3G/2TwBEQ9wfs795xhrDthf4DqMvcAA3l+ujq/O23Phx7UzocS3Q+HGuf9Pe5vas6FBYc9zFyrQQgLfOmTmU3zFyEiMjg4zYpAXbtq9xdgzvmYXjDI80RBi2nSxcRsZ0otiFMdJ966zjnNq5x1+WVz4iji7F0U04SmoAyBnQ1ua6E+O6vKG03e3cRuJg9jmpVPdspRh5X1nqLlXQtYpP9RtrSL7y1TPF4UOr1n53YP8ZR6thfBYRd6jK571f3wc4yFHdOzalTwGtOU7qKA3MmHGWsWbNd30NG5534rrc1SvPdwzJOsbTYyuLs+iq3VDaWq3WaJxkGcc8Tc8cRmvJQ2EQRs4/YT1wZv+iW85+F9nbgWmOarffYKllFETkI2oY52AYfbR5rx2n0ZlrjoHIMcDVzeTIh7klOOxBUM+s1jWwvjKuyRK/cc8Sp2vetbN3TJn0orbnJ8do1R1+6G15L65WS1L4Bkgu9qr2jVnLjSt+8BkVOTaDcvzMfwCCw5A2Uayd87EyhlG7dbpvzz/FAdZ6oWXILVr5M0f1GdzZu/fS8KwboHpgK3QMf21EvD/BNos0tvjOfgJuSltvX3zOQPuIXcRRJ3Pm1+qs0NHMoVAk+ah7boc9lxH79aZDTUrQkaiPle5kO5qxA5EB+ctuMqg5ne/LpKBFqM2ftRpHH0zl7+hurdAxSF1y0GRliTZ4Wx7GdSORNZYgDP3rl+/O7xhemukbpQR1NFSb6jjpfoOjkKJYI5cU3ha79iUcxxmLHEELpU38PMfg061UfhRqjnMIjtOdSntnhthRCVIbTJeh1tIaneE710kh5rzjDoUd7e7aUd9497ejzRsi06HvtbcWyEhtLTVlVCF6qqCJAkjCUOhnrcx5DOXqzAlIWghXxLbY2kXg2cnJybmLb0zew0sB9xsBvaZhoRPXR4aSc793IKY1hZpzVJrFEtve1AqdvChGqrcQrdCeLoOOgMIGLVeW3wP8ael5g93/umLW9t7OZ9wD92MEx0nnpQDpigXQNlQrj3TljkCIbFU08/FC4/4m0K1Ab+Kil5B38nKXVKrfAfkZwjuu+xr1YRWQPMr+CBcBe4aWZCJ0DVt/nyiZaRmgu6PSmcIj8Ft/rYF69NP2Ar2KDH9T7NqatLQgRJz3IAXc/aroy504lzT4zblr2kvV+SOd+SXNsZNBaxmKBYnOexCGrzx1OHfxjbOcvPwakYBiJFR+ymRGSwVHTOtJ4HOpuEIncKEXGj5seNrtxiXRLIZxVel+Z+jJKIaY1lHAdSDTM3lE6ceVKpiYIIsL+e2D96QmBsBA6z6W9yZnuENdfS0pCDXHnZkkBG1xxvKXT2xYagzZ9zZduU5zWLP8m5qDtLCGW7t0zivicHZ4S6oeNPE3PhrqzXHc+rOmvIvySOIdTXPjuWFn7dTnB0JHo6VS3R/lLpTp7wWPZuUQ21774YcffbppBVNfSTcM/O2AfM6lUl/xDRbEroFtJ4daa4uCv/3Fpc64t7YXxXYGMp3w6GJeENIqznUCW5LDqRR/gPLDsBMVfQ78xj/evR1/Kp9EIzplTuIRhaQ01+J0bh2+/MUXrgpXssg8/GWBneXRrBzqdGx996JXXry7pfNahr9Dr+puX4xEQhBs20jd9hhpfS689bqzBtoHR2aDN+PLds9GBS/8+t9aliM3oqeDbogltDAyaLlgA1+BiEOd1Z5p8ay2BtoH7dunPzXwY6Kg7P1e8YhBJC0/OHTDHg88cXdGjhAYOGpkzLLCzqKjERMZChtaZQowtOi0+/M7nGsTO0ios6Q0fNIsTmn+mVkA7MvnvGPUmAVqxzpokIeqPW6zvT6aX8vFVSgngQ6ndvYsI1DnQVq6kN9Re3zKui3F1asujXcY8bbkdpJHprwo+aEdt059YtW8l1++o+VOa0h9CKlvWDZ+3wbi57ejG5z1abDqKL58dmGXP/zPQsN2VifS9Z6NGnFHP84fVMnZ2sLHEmGomcWnxeHSNJqg5HfoLZuqZ8TP6gN6SfEOqfEpVNfH8hOhGY1n8ETV7thmL5/6wuaj/3DnN1LOre8kj2Zxx9nWsXVwwV/f+8xXXn26OqqljoBDElBX5RXg6MQPHySi0sqAKF/UcnFU1gJgYOV5Q+M2j3whN+w0PlMScf0ZZTA3ovNrZjH25W3s4gplKL9DF9qXzbFGKwNA759GLjNsvoP7LZ5L0zvq3LZdb538+6Ezs/I7ZvHp7i21vzVsPVdqrEVx/HL4H5EG5K2H0OzWfRaHrW3bnR/3/deOTwxdferXXr3vGxn3jY2NRxgvmgeMmvNa2+Dwt/rXv/l3Q4vPvvqlF28a9a66dFyw5HCnLddOY7vm7Y6tQ6veXXpejFjXBUsPcfKGe9mHW5htnVt3PL/lhnN2auHuY/tfYbxy8MQZI53GbgiIYndutVdtXnZGbDGu6+vLp6k0PtwUVbtns73qT9U47mhhwpnLdhvuNmbgfiHudG+x17214vTYENgM+r92/ZTt43N7qkhPNmZjYiKK0769NrDby9t+9/Kj81u6vK79wuWHGo67lpYwxQmD4LgWiZB+BfMZNWeoa/Pghg8///vX17x43U4c0QDRVjd/P4APYBTwf7P39AH8v4MPFOsDeF/gA8X6AN4XyIsZulPBBl2npaL/lbB756cGLrMVgNe1VFgrZrUb5FDg0egNv2JauwO7a6nwK+/qyG1aKqwNpO8JdGupsFpM63Cg03clFRBZraXCgJjWVGDvhpspoLyuZZeWmNZ0oFdLhVVefD+U17Rc2BTgdRCwvj7LdXF0slsUd/YHukZLxYGkShLTOhR0vZaKb3h3mx4G+piWio6bXu0EOVRLhYc9/GlAPnh9k1deQ0uFdQGc6YQ791YtFZ4W05oCzAB9VEtFG0Aq1Xbc+z0f11JxyKNxJLBWS4UBqVgGwpGEvhUVgCEtFR4T09oXGKzL1OCvgTN2vFO/SEQq1V5E9tJS4dlGGaqTQKa3ctmIgXIf6HxgLujZqLwoZvXyAM48VL6NcgLICaieAOqdDJCpKA+AJh1s+zzqr0Hth/KQmFaPV6g8yp0o7vlp5WZgvs8DTgD2CND5PjALZBZwOvCiVKre/Qb6JZSKz1W5HHhGzOpegXffRvUgj/deKM+BzAWZi+pc0Aoqd2bU0wrqNxG7HxU8ArLSVSgAmYRyVwNdj0N5QSrV4KVos9069mV6CmUhqnNR5oLORXlIKtWjgCGUlcCXfXzhVFTKvlJVqsd6+4QrvHQAtzwqK0CuAZ0LnOTxuxh0doD/c6ALPJnq/H8hlerhHsZeKM+IWb3c/yJaZf9Am2ZC/XTDAi0VngcQ0zoAlV+KWb0+YLleAlmBYmu5+GwKrQzQ5SBnAvOBMnAKwjYguEb1EMjjwNtaLq6LEPidlopf8uTrAzZnH73Rt1F5SkxrppYKj0YS+wAbYaZX/j5gEmiTW5ZDexwOqtNBHhGz+oWEfUQQ1qNys5hWWUuFb4VSTctA6AUu1lLRP7EgFetVRPq0VHhHKtUyyqViWj90DZBcBDrTy98OcgWu0qwQ0zrSs5YzPTo/AdZrqbggqQyeovSCLAxZpIr1R8JHZjYBJ6NMk4o129vdaAmM+rJ9ANYhGKh4l14oCPuCzkc4O0ahhf0mLRVtROcBF0ilugdQRnWhfzmIi/dFz3J+PoHOAVKx/ltM6y3gVdANoO41PZF1GW94uwbRhcBdUrG+ingLlvUMDfx9ER7AvQPhtoySNKrI5yefQRgAeQbRvUIyuLsZz4L+A7BAKtXrUe/DlSwI1aUsxz3HdQFwDsLzWvaUUDkNYSuwBvQWYLF7V349a331PEI7eIgwqd3i/WMbyMEI0xAeQZmU2d4BqH+l0+n9Z4heRM4HNoG6VsNtkIe9nXS84czWUiG4KNotplXfR3K0VBisy18HLRXv984w/QfKOi0XH24kAvBtRO4O8Bjy/TbleYS/B5YAhyD8k/8fMKK9yGt4LRWXi2ltQPgRmmCN3P/W8BLIJ4FjgIWZNRXZP0MYBJmJ6iJEfhaSwfPdtFz4lZjWgcA9CFNBlkeE6HavGqj3QIz6ZXdaLthSqc4D/REiw6h+CkAq1T5ELgIdcPkKwB4IXwUsX4BExQntmIBod9098Q7+Re6GULRcHBDT+hRwM+j1INHRJBEMkK0g96BsRPgNcBiqX9Sy13DucdgTQTeiuhHYSONGZAfYivJb7/1G3C88AIbdyg/BPIReJNKIwjaEZaAbXT5sBE7x6biOv62lwunAg6g8JKY1w0vfAQE+Lk8bQEuFB1E+CbxBY7tmgxf/oyuzbkT1OpQsh3RbIz8OsA0FLRUcLRfnAfMRGhedKcPAkCfDBkQ+Afq0VxY8S/0kyE+8snpBO0H86yy1XLwf5DHQO7RcXOuV7xzgQS0V99FSYR8tF/YB5oEucCdTADroyRCEQdAGf+FJkDv9NhXZ6PXQuuLYnruCZyhmAjd4ddEU/hcH/wKO+zYaOwAAAABJRU5ErkJggg==', 'PNG', 0.4, 0.4);


		menu.dishes.map((dish, i) => {
			return (
				// doc.setTextColor(9, 93, 117),
				doc.text(dish.name, 1, i + 2.2),
				doc.text(dish.count.toString(), 6.5, i + 2.2)
			)
		})

		doc.setTextColor(30, 129, 158);
		doc.setFontSize(25)
		doc.text(menu.name.toUpperCase(), 2, 1.5)

		doc.viewerPreferences({
			'HideWindowUI': true,
			'PrintArea': 'CropBox',
			'NumCopies': 10,
			'CenterWindow': true
		})

		doc.save(menu.name)

	}

	render() {
		return (
			<React.Fragment>
				<Button
					shape="circle"
					icon="left"
					onClick={() => this.props.history.push('/🥢')}
				/>
				<Divider />
				<div className='report' >
					{this.props.getMenuBySite.menusBySite &&
						this.props.getMenuBySite.menusBySite.map((menuBySite, i) => {
							return (
								<div key={i} style={{ marginBottom: 10 }}>
									<ListMenu menuId={menuBySite._id} menu={menuBySite} />
									<div
										style={{
											display: 'flex',
											marginTop: 10,
											justifyContent: 'space-between'
										}}
									>
										<Button
											className="publish"
											onClick={() => this.isLock(menuBySite._id)}
										>
											<Icon
												type={menuBySite.isLocked ? "lock" : 'unlock'}
											/>
										</Button>

										<Button
											onClick={() => this.onRequest(menuBySite)}
											variant="raised"
											color="secondary"
										>
											Request 1st delivery
									</Button>

										<Button
											className="publish"
											onClick={() => this.isActive(menuBySite._id)}
										>
											Complete
									</Button>
									</div>
								</div>
							)
						})}
				</div>
			</React.Fragment>
		)
	}
}

const GET_MENU_BY_SITE = gql`
	query menusBySite($siteId: String!) {
		menusBySite(siteId: $siteId) {
			_id
			name
			isActive
			isLocked
			dishes {
				name
				count
				_id
			}
		}
	}
`

const LOCK_AND_UNLOCK_MENU = gql`
	mutation lockAndUnlockMenu($id: String!) {
		lockAndUnlockMenu(id: $id)
	}
`

const CLOSE_MENU = gql`
	mutation closeMenu($id: String!) {
		closeMenu(id: $id)
	}
`

const ORDER_BY_MENU = gql`
	query ordersByMenu($menuId: String!){
		ordersByMenu(menuId: $menuId){
			userId
			dishId
			count
		}
	}
`

const GET_USER_NAME = gql`
	query user($_id: String!){
		user(_id: $_id){
			username
			fullName
		}
	}
`

export default HOCQueryMutation([
	{
		query: GET_MENU_BY_SITE,
		name: 'getMenuBySite',
		options: props => {
			return ({
				variables: {
					siteId: localStorage.getItem('currentsite')
				}
			})
		}
	},
	// {
	// 	query: ORDER_BY_MENU,
	// 	name: 'getOrderByMenu',
	// 	// options: props => {
	// 	// 	return ({
	// 	// 		variables: {
	// 	// 			menuId: "3f423520-a214-11e9-83ee-5f5fb731ebb3"
	// 	// 		}
	// 	// 	})
	// 	// }
	// },
	// {
	// 	query: GET_USER_NAME,
	// 	name: 'getUserName',
	// 	options: props => {
	// 		return ({
	// 			variables: {
	// 				_id: "40eb5c20-9e41-11e9-8ded-f5462f3a1447"
	// 			}
	// 		})
	// 	}
	// },
	{
		mutation: LOCK_AND_UNLOCK_MENU,
		name: 'lockAndUnLockMenu',
		option: {}
	},
	{
		mutation: CLOSE_MENU,
		name: 'closeMenu',
		option: {}
	}
])(Report)
